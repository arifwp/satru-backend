import mongoose, { mongo, Schema } from "mongoose";
import { IUser } from "../interface/userInterface";
import { PASSWORD_REGEX } from "../utils/passwordRegex";

const UserSchema: Schema<IUser> = new Schema<IUser>({
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  outletId: {
    type: [],
    required: [true, "Outlet id harus diisi"],
  },
  name: { type: String, required: [true, "Nama Harus diisi"], trim: true },
  email: {
    type: String,
    required: [true, "Email Harus diisi"],
    unique: true,
    trim: true,
    validate: {
      validator: function (value: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "Gunakan email yang valid",
    },
  },
  phone: {
    type: String,
    required: [true, "Nomor telepon harus diisi"],
    minlength: [10, "Minimal 10 angka"],
    maxlength: [15, "Maksimal 15 angka"],
    unique: true,
    trim: true,
  },
  owner: {
    type: Boolean,
    required: [true, "Status kepemilikan harus diisi"],
    default: false,
  },
  bornDate: {
    type: Date,
    required: [true, "Tanggal lahir harus diisi"],
  },
  avatar: { type: String, required: false },
  status: {
    type: Number,
    required: [true, "Status user harus diisi"],
    default: 1,
  },
  password: {
    type: String,
    required: true,

    validate: {
      validator: function (value: any) {
        return PASSWORD_REGEX.test(value);
      },
      message:
        "Password harus minimal 8 karakter, mengandung huruf kecil, huruf besar, dan karakter spesial",
    },
  },
  lastLogin: { type: Date },
  token: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: false },
});

UserSchema.pre<IUser>("save", function (next) {
  if (!this.ownerId) {
    this.ownerId = this._id as mongoose.Types.ObjectId;
  }
  next();
});

UserSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.code === 11000) {
    if (error.keyPattern.email) {
      next(new Error("Email sudah dipakai"));
    } else if (error.keyPattern.phone) {
      next(new Error("Nomor telepon sudah dipakai"));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
