import { Document, Types } from "mongoose";

export interface Discount_Interface extends Document {
  ownerId: Types.ObjectId;
  outletId: Array<Types.ObjectId>;
  name: string;
  discountType: number;
  discount: number;
  expiredDate: Date;
  isDeleted: number;
  createdAt: Date;
}
