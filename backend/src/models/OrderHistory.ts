import mongoose, { Schema, model } from "mongoose";

interface IOrderHistory {
  user: Schema.Types.ObjectId;
  products: Array<{
    product: Schema.Types.ObjectId;
    quantity: number;
  }>;
  total: number;
  timestamps?: Date;
}

const orderHistorySchema = new Schema<IOrderHistory>({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  timestamps: { type: Date, default: Date.now },
});

export default mongoose.models.OrderHistory || model<IOrderHistory>("OrderHistory", orderHistorySchema);