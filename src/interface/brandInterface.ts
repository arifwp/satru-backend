import { Document } from "mongoose";

export interface Brand_Interface extends Document {
  name: string;
  isDeleted: Number;
  createdAt: Date;
}
