import { Request, Response } from "express";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

connect();
Product;

export async function addToCart(req: Request, res: Response) {
  const { product, quantity } = req.body;
  if (!product || !quantity) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }
  
  try {
    const user = (await User.find({})).pop();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify product exists in database
    const productInDb = await Product.findById(product);
    if (!productInDb) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product already exists in THIS user's cart
    const userCart = await Cart.findOne({ 
      user: user._id,
      "products.product": product 
    });
    
    if (userCart) {
      // Product exists, increment the quantity
      await Cart.updateOne(
        { 
          user: user._id,
          "products.product": product 
        },
        {
          $inc: {
            "products.$.quantity": quantity
          }
        }
      );
      return res.status(200).json({ message: "Product quantity updated in cart" });
    }

    // Product doesn't exist, add it to cart (upsert creates cart if needed)
    await Cart.updateOne(
      { user: user._id },
      {
        $push: {
          products: {
            product: product,
            quantity,
          },
        },
      },
      { upsert: true }
    );
    
    return res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const user = (await User.find({})).pop();
    const cart = await Cart.findOne({ user: user?._id }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeItemFromCart(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  try {
    const user = (await User.find({})).pop();
    const cart = await Cart.findOne({ user: user?._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== id
    );
    await cart.save();
    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}