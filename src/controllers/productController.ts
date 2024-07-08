import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Brand from "../models/brandModel";
import Category from "../models/categoryModel";
import Product from "../models/productModel";

export const createProduct = async (req: Request, res: Response) => {
  const {
    code,
    name,
    description,
    price,
    categoryId,
    brandId,
    stock,
    minimumStock,
    variant,
  } = req.body;

  const isCategoryValid = mongoose.Types.ObjectId.isValid(categoryId);
  const isBrandValid = mongoose.Types.ObjectId.isValid(brandId);

  if (minimumStock > stock) {
    return res
      .status(400)
      .json({ message: "Minimum stok tidak boleh lebih dari stok" });
  }

  if (!isCategoryValid) {
    return res.status(404).json({ message: "Id category tidak valid" });
  }

  if (!isBrandValid) {
    return res.status(404).json({ message: "Id brand tidak valid" });
  }

  try {
    const getCategory = await Category.findById({ _id: categoryId });
    const getBrand = await Brand.findById({ _id: brandId });
    if (!getCategory) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    if (!getBrand) {
      return res.status(404).json({ message: "Merk tidak ditemukan" });
    }

    // Validasi variant array
    const validatedVariants = variant.map((v: any) => {
      return {
        variantId: new ObjectId(),
        variantName: v.variantName,
        variantPrice: v.variantPrice,
        variantStock: v.variantStock,
        isDeleted: 0,
        createdAt: Date.now(),
      };
    });

    const newProduct = new Product({
      code: code,
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      brandId: brandId,
      stock: stock,
      minimumStock: minimumStock,
      variant: validatedVariants,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const product = await newProduct.save();
    res
      .status(201)
      .json({ message: "Berhasil menambahkan produk", data: product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({
      name: name,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const category = await newCategory.save();
    res
      .status(201)
      .json({ message: "Berhasil menambahkan kategori", data: category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newBrand = new Brand({
      name: name,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const brand = await newBrand.save();
    res.status(201).json({ message: "Berhasil menambahkan merk", data: brand });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
