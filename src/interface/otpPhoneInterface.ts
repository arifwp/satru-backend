import { Document, Types } from "mongoose";

export interface Otp_Phone_Interface extends Document {
  userId: Types.ObjectId;
  otpCode: number;
  oldWa: string;
  newWa: string;
  expiredAt: Date;
  createdAt: Date;
}
