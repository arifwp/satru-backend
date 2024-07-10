import mongoose, { Schema } from "mongoose";
import { Type_Outlet_Interface } from "../interface/typeOutletInterface";

const TypeOutletSchema: Schema<Type_Outlet_Interface> =
  new Schema<Type_Outlet_Interface>({
    name: {
      type: String,
      requierd: [true, "Nama tipe harus diisi"],
    },
    isDeleted: {
      type: Number,
      required: [true, "Keterangan delete harus diisi"],
      default: 0,
    },
    createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
  });

const TypeOutlet = mongoose.model<Type_Outlet_Interface>(
  "TypeOutlets",
  TypeOutletSchema
);

export default TypeOutlet;
