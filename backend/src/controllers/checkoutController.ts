import Product from "@/models/Product";
import User from "@/models/User";
import { Request, Response } from "express";
import { connect } from "@/lib/db";
import Cart from "@/models/Cart";
import OrderHistory from "@/models/OrderHistory";
import { Types } from "mongoose";

connect();

// Define interfaces for the data structures
interface CartItem {
  product: string;
  quantity: number;
}

interface ProductDocument {
  _id: Types.ObjectId;
  name: string;
  price: number;
  [key: string]: unknown;
}

interface CartProductItem {
  product: Types.ObjectId;
  quantity: number;
}

interface CartDocument {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: CartProductItem[];
  save(): Promise<CartDocument>;
}

export async function checkout(req: Request, res: Response) {
  const { cartItems } = req.body as { cartItems: CartItem[] };
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res
      .status(400)
      .json({ message: "Cart items are required for checkout" });
  }

  try {
    const user = (await User.find({})).pop();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartInDb = await Cart.findOne({ user: user._id }) as CartDocument | null;
    if (!cartInDb) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const productsInDbCartIds = cartInDb.products.map((item: CartProductItem) => 
      item.product.toString()
    );
    
    // Validate all items and prepare order products
    const orderProducts: Array<{ product: Types.ObjectId; quantity: number }> = [];
    let total = 0;
    
    for (const item of cartItems) {
      if (!productsInDbCartIds.includes(item.product)) {
        const product = await Product.findById(item.product) as ProductDocument | null;
        if(!product){
          return res
            .status(400)
            .json({ message: `Product ${item.product} does not exist` });
        }
        return res
          .status(400)
          .json({ message: `Product ${item.product} not in cart` });
      }
      
      // Verify product exists
      const product = await Product.findById(item.product) as ProductDocument | null;
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product} does not exist` });
      }
      
      orderProducts.push({
        product: product._id,
        quantity: item.quantity
      });

      // Calculate total
      total += product.price * item.quantity;
    }
    
    // Update cart quantities or remove items
    for (const checkoutItem of cartItems) {
      const cartItemIndex = cartInDb.products.findIndex(
        (item: CartProductItem) => item.product.toString() === checkoutItem.product
      );
      
      if (cartItemIndex !== -1) {
        const cartItem = cartInDb.products[cartItemIndex];
        
        if (checkoutItem.quantity >= cartItem.quantity) {
          // Remove item if checkout quantity is equal to or greater than cart quantity
          cartInDb.products.splice(cartItemIndex, 1);
        } else {
          // Reduce the quantity
          cartInDb.products[cartItemIndex].quantity -= checkoutItem.quantity;
        }
      }
    }
    
    await cartInDb.save();
    
    // Create and save order history with total
    const orderHistory = new OrderHistory({
      user: user._id,
      products: orderProducts,
      total,
      timestamps: new Date()
    });
    
    await orderHistory.save();
    
    return res.status(200).json({
      success: true,
      message: "Checkout completed successfully",
      cart: cartInDb,
      order: orderHistory,
      user
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}