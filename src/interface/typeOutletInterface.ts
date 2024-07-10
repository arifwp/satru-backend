import { Document, Types } from "mongoose";

export interface Type_Outlet_Interface extends Document {
  name: string;
  isDeleted: number;
  createdAt: Date;
}
