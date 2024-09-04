import { Document, Types } from "mongoose";

export interface Member_Interface extends Document {
  ownerId?: Types.ObjectId;
  assignedBy?: Types.ObjectId;
  name: string;
  phone: string;
  bornDate: Date;
  gender: string;
  totalTransaction: number;
  isDeleted: number;
  createdAt: Date;
}
