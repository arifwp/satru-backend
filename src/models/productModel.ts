import mongoose, { Schema, Types } from "mongoose";
import { Product_Interface } from "../interface/productInterface";

const ProductSchema: Schema<Product_Interface> = new Schema<Product_Interface>({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Owner id harus diisi"],
  },
  outletId: {
    type: [],
    required: [true, "Outlet id harus diisi"],
  },
  code: { type: String, unique: true, trim: true },
  name: { type: String, required: [true, "Nama Harus diisi"], trim: true },
  description: {
    type: String,
    required: [true, "Deskripsi harus diisi"],
    trim: true,
  },
  price: { type: Number, required: [true, "Harga harus diisi"], trim: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Kategori harus diisi"],
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: false,
  },
  stock: { type: Number, required: [true, "Stok harus diisi"] },
  minimumStock: { type: Number },
  imageProduct: { type: String },
  variants: [
    {
      variantName: {
        type: String,
        required: [true, "Nama varian harus diisi"],
        trim: true,
      },
      variantPrice: {
        type: Number,
        required: [true, "Harga varian harus diisi"],
      },
      variantStock: {
        type: Number,
        required: [true, "Stok varian harus diisi"],
      },
      isDeleted: {
        type: Number,
        required: [true, "Keterangan delete harus diisi"],
        default: 0,
      },
      createdAt: {
        type: Date,
        required: [true, "Tanggal dibuat harus diisi"],
        default: Date.now(),
      },
    },
  ],
  isDeleted: {
    type: Number,
    required: [true, "Keterangan delete harus diisi"],
  },
  createdAt: { type: Date, required: [true, "Tanggal dibuat harus diisi"] },
});

ProductSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.code === 11000) {
    if (error.keyPattern.code) {
      next(new Error("Kode produk sudah digunakan"));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

const Product = mongoose.model<Product_Interface>("Products", ProductSchema);

export default Product;
