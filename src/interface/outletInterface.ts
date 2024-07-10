import { Document, Types } from "mongoose";
import { Type_Outlet_Interface } from "./typeOutletInterface";

export interface Outlet_Interface extends Document {
  ownerId: Types.ObjectId;
  name: string;
  estEmployee: number;
  address: string;
  typeId: Type_Outlet_Interface;
  isDeleted: number;
  createdAt: Date;
}
