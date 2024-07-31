import mongoose, { Schema } from "mongoose";
import { Otp_Phone_Interface } from "../interface/otpPhoneInterface";

const OtpPhoneSchema: Schema<Otp_Phone_Interface> =
  new Schema<Otp_Phone_Interface>({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id harus diisi"],
    },
    otpCode: {
      type: Number,
      required: [true, "Kode otp harus diisi"],
    },
    oldWa: {
      type: String,
      required: [true, "Nomor lama harus diisi"],
    },
    newWa: {
      type: String,
      required: [true, "Nomor baru harus diisi"],
    },
    expiredAt: {
      type: Date,
      required: [true, "Waktu expired code harus diisi"],
    },
    createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
  });

const OtpPhone = mongoose.model<Otp_Phone_Interface>(
  "OtpPhones",
  OtpPhoneSchema
);

export default OtpPhone;
