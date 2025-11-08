import mongoose, { Schema, model } from "mongoose";

interface  ICart {
  user: Schema.Types.ObjectId;
  products: Array<{
    product: Schema.Types.ObjectId;
    quantity: number;
  }>;
}

const cartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User", unique: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.Cart || model<ICart>("Cart", cartSchema);