import { Document, Types } from "mongoose";

export interface Brand_Interface extends Document {
  ownerId: Types.ObjectId;
  name: string;
  isDeleted: Number;
  createdAt: Date;
}
