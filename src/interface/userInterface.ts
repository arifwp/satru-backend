import { Document, Types } from "mongoose";

export interface IUser extends Document {
  ownerId?: Types.ObjectId;
  outletId: Array<Types.ObjectId>;
  name: string;
  email: string;
  phone: string;
  owner: boolean;
  bornDate: Date;
  avatar?: string;
  status: number;
  password: string;
  lastLogin?: Date;
  token?: string;
  createdAt: Date;
  updatedAt?: Date;
}
