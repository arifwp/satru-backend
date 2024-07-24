import mongoose, { Schema } from "mongoose";
import { Otp_Interface } from "../interface/otpInterface";

const OtpSchema: Schema<Otp_Interface> = new Schema<Otp_Interface>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User id harus diisi"],
  },
  otpCode: {
    type: Number,
    required: [true, "Kode otp harus diisi"],
  },
  expiredAt: { type: Date, required: [true, "Waktu expired code harus diisi"] },
  createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
});

const Otp = mongoose.model<Otp_Interface>("Otps", OtpSchema);
export default Otp;
