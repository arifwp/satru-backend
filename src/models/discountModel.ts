import mongoose, { mongo, Schema } from "mongoose";
import { Discount_Interface } from "../interface/discountInterface";

const DiscountSchema: Schema<Discount_Interface> =
  new Schema<Discount_Interface>({
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Owner ID Harus diisi"],
    },
    outletId: {
      type: [],
      required: [true, "Outlet id harus diisi"],
    },
    name: {
      type: String,
      required: [true, "Nama diskon harus diisi"],
      trim: true,
    },
    discountType: {
      type: Number,
      required: [true, "Jenis diskon harus diisi"],
    },
    discount: { type: Number, required: [true, "Diskon harus diisi"] },
    expiredDate: {
      type: Date,
      required: [true, "Tanggal expired harus diisi"],
    },
    isDeleted: {
      type: Number,
      required: [true, "Keterangan delete harus diisi"],
      default: 0,
    },
    createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
  });

const Discount = mongoose.model<Discount_Interface>(
  "Discounts",
  DiscountSchema
);

export default Discount;
