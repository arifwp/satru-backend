import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import Brand from "../models/brandModel";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import { ResourceDataWithImage } from "../utils/resource";

const fsPromises = fs.promises;

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
    variants,
  } = req.body;

  const imageProduct = req.file?.filename;
  const isCategoryValid = mongoose.Types.ObjectId.isValid(categoryId);
  const isBrandValid = mongoose.Types.ObjectId.isValid(brandId);

  if (Number(minimumStock) > Number(stock)) {
    return ResourceDataWithImage(
      false,
      400,
      "Minimum stok tidak boleh lebih dari stok",
      "../../uploads/products",
      imageProduct,
      res
    );
  }

  if (!isCategoryValid) {
    return ResourceDataWithImage(
      false,
      404,
      "Id kategori tidak valid",
      "../../uploads/products",
      imageProduct,
      res
    );
  }

  if (!isBrandValid) {
    return ResourceDataWithImage(
      false,
      404,
      "Id merk tidak valid",
      "../../uploads/products",
      imageProduct,
      res
    );
  }

  try {
    const getCategory = await Category.findById({ _id: categoryId });
    const getBrand = await Brand.findById({ _id: brandId });

    if (!getCategory) {
      return ResourceDataWithImage(
        false,
        404,
        "Kategori tidak ditemukan",
        "../../uploads/products",
        imageProduct,
        res
      );
    }

    if (!getBrand) {
      return ResourceDataWithImage(
        false,
        404,
        "Merk tidak ditemukan",
        "../../uploads/products",
        imageProduct,
        res
      );
    }

    const newProduct = new Product({
      code: code,
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      brandId: brandId,
      stock: stock,
      minimumStock: minimumStock,
      imageProduct: imageProduct,
      variants: variants
        ? variants.map((variant: any) => ({
            variantId: new mongoose.Types.ObjectId(),
            variantName: variant.variantName,
            variantPrice: variant.variantPrice,
            variantStock: variant.variantStock,
            isDeleted: 0,
            createdAt: Date.now(),
          }))
        : [],
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const product = await newProduct.save();

    res
      .status(201)
      .json({ message: "Berhasil menambahkan produk", data: product });
  } catch (error: any) {
    return ResourceDataWithImage(
      false,
      500,
      error.message,
      "../../uploads/products",
      imageProduct,
      res
    );
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
