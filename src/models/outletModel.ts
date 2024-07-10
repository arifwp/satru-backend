import mongoose, { Schema } from "mongoose";
import { Outlet_Interface } from "../interface/outletInterface";

const OutletSchema: Schema<Outlet_Interface> = new Schema<Outlet_Interface>({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Owner id harus diisi"],
  },
  name: {
    type: String,
    required: [true, "Nama outlet harus diisi"],
  },
  estEmployee: {
    type: Number,
    required: [true, "Estimasi karyawan harus diisi"],
  },
  address: {
    type: String,
    required: [true, "Alamat bisnis harus diisi"],
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Tipe bisnis harus diisi"],
  },
  isDeleted: {
    type: Number,
    required: [true, "Keterangan delete harus diisi"],
    default: 0,
  },
  createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
});

const Outlet = mongoose.model<Outlet_Interface>("Outlets", OutletSchema);
export default Outlet;
