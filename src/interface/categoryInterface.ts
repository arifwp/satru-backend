import { Document, Types } from "mongoose";

export interface Category_Interface extends Document {
  ownerId: Types.ObjectId;
  name: string;
  isDeleted: Number;
  createdAt: Date;
}
