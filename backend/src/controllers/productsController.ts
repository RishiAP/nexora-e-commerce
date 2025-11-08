import Product from "@/models/Product";
import { Request, Response } from "express";
import { connect } from "@/lib/db";

connect();

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}