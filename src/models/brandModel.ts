import mongoose, { Document, Schema } from "mongoose";
import { Types } from "mongoose";
import { Category_Interface } from "../interface/categoryInterface";
import { Brand_Interface } from "../interface/brandInterface";

const BrandSchema: Schema<Brand_Interface> = new Schema<Brand_Interface>({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Owner id harus diisi"],
  },
  name: {
    type: String,
    required: [true, "Nama merk harus diisi"],
    trim: true,
  },
  isDeleted: {
    type: Number,
    required: [true, "Keterangan delete harus diisi"],
  },
  createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
});

const Brand = mongoose.model<Brand_Interface>("Brands", BrandSchema);

export default Brand;
