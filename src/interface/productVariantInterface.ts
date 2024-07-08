import { Document, Types } from "mongoose";

export interface Product_Variant_Interface extends Document {
  variantId: Types.ObjectId;
  variantName: string;
  variantPrice: number;
  variantStock: number;
  isDeleted: number;
  createdAt: Date;
}
