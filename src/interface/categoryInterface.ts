import { Document } from "mongoose";

export interface Category_Interface extends Document {
  name: string;
  isDeleted: Number;
  createdAt: Date;
}
