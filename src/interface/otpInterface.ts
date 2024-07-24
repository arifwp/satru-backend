import { Document, Types } from "mongoose";

export interface Otp_Interface extends Document {
  userId: Types.ObjectId;
  otpCode: number;
  expiredAt: Date;
  createdAt: Date;
}
