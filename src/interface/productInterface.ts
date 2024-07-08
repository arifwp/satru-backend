import { Document, Types } from "mongoose";
import { Product_Variant_Interface } from "./productVariantInterface";

export interface Product_Interface extends Document {
  code?: string;
  name: string;
  description: string;
  price: number;
  categoryId: Types.ObjectId;
  brandId?: Types.ObjectId;
  stock: number;
  minimumStock?: number;
  img?: String;
  variant?: Array<Product_Variant_Interface>;
  isDeleted: number;
  createdAt: Date;
}
