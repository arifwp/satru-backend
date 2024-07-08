import mongoose, { Document, Schema } from "mongoose";
import { Types } from "mongoose";
import { Category_Interface } from "../interface/categoryInterface";

const CategorySchema: Schema<Category_Interface> =
  new Schema<Category_Interface>({
    name: {
      type: String,
      required: [true, "Nama kategori harus diisi"],
      trim: true,
    },
    isDeleted: {
      type: Number,
      required: [true, "Keterangan delete harus diisi"],
    },
    createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
  });

const Category = mongoose.model<Category_Interface>(
  "Categorys",
  CategorySchema
);

export default Category;
