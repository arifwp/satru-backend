import mongoose, { Schema } from "mongoose";
import { Member_Interface } from "../interface/memberInterface";

const MemberSchema: Schema<Member_Interface> = new Schema<Member_Interface>({
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  assignedBy: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  name: {
    type: String,
    required: [true, "Nama member harus diisi"],
    trim: true,
  },
  gender: {
    type: String,
    required: [true, "Jenis kelamin harus diisi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor telepon harus diisi"],
    minlength: [10, "Minimal 10 angka"],
    maxlength: [15, "Maksimal 15 angka"],
    unique: true,
    trim: true,
  },
  bornDate: {
    type: Date,
    required: [true, "Tanggal lahir harus diisi"],
  },
  totalTransaction: { type: Number, required: true, default: 0 },
  isDeleted: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Member = mongoose.model<Member_Interface>("Member", MemberSchema);

export default Member;
