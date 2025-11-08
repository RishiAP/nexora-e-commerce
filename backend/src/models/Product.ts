import mongoose, { Schema, model } from "mongoose";

interface IProduct {
  name: string;
  price: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Product || model<IProduct>("Product", productSchema);
