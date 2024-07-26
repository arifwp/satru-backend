import { Document, Types } from "mongoose";

export interface Otp_Interface extends Document {
  userId: Types.ObjectId;
  otpCode: number;
  oldEmail: string;
  newEmail: string;
  expiredAt: Date;
  createdAt: Date;
}