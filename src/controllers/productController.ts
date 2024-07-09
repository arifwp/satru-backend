import { Request, Response } from "express";
import fs from "fs";
import mongoose, { mongo } from "mongoose";
import path from "path";
import Brand from "../models/brandModel";
import Category from "../models/categoryModel";
import Product from "../models/productModel";
import { ResourceDataWithImage } from "../utils/resource";
import { Product_Interface } from "../interface/productInterface";
import { Product_Variant_Interface } from "../interface/productVariantInterface";

const fsPromises = fs.promises;

// PRODUCT
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
  let isBrandValid;
  if (brandId) {
    isBrandValid = mongoose.Types.ObjectId.isValid(brandId);
  }

  if (minimumStock) {
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

  if (brandId) {
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
  }

  try {
    const getCategory = await Category.findById({ _id: categoryId });
    let getBrand;
    if (brandId) {
      getBrand = await Brand.findById({ _id: brandId });
    }

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

    if (brandId) {
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
    }

    let addNew = {
      code: code,
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      stock: stock,
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
      createdAt: new Date(Date.now()),
    };

    if (brandId) {
      Object.assign(addNew, { brandId: brandId });
    }

    if (minimumStock) {
      Object.assign(addNew, { minimumStock: minimumStock });
    }

    if (imageProduct) {
      Object.assign(addNew, { imageProduct: imageProduct });
    }

    const newProduct = new Product(addNew);

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

export const updateProduct = async (req: Request, res: Response) => {
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

  const productId = req.params.productId;
  const uploadImage = req.file?.filename;
  const isProductIdValid = mongoose.Types.ObjectId.isValid(productId);
  const isCategoryValid = mongoose.Types.ObjectId.isValid(categoryId);
  let isBrandValid;
  if (brandId) {
    isBrandValid = mongoose.Types.ObjectId.isValid(brandId);
  }

  if (!isProductIdValid) {
    return ResourceDataWithImage(
      false,
      400,
      "Produk id tidak valid",
      "../../uploads/products",
      uploadImage,
      res
    );
  }

  if (minimumStock) {
    if (Number(minimumStock) > Number(stock)) {
      return ResourceDataWithImage(
        false,
        400,
        "Minimum stok tidak boleh lebih dari stok",
        "../../uploads/products",
        uploadImage,
        res
      );
    }
  }

  if (!isCategoryValid) {
    return ResourceDataWithImage(
      false,
      404,
      "Id kategori tidak valid",
      "../../uploads/products",
      uploadImage,
      res
    );
  }

  if (brandId) {
    if (!isBrandValid) {
      return ResourceDataWithImage(
        false,
        404,
        "Id merk tidak valid",
        "../../uploads/products",
        uploadImage,
        res
      );
    }
  }

  try {
    const getCategory = await Category.findById({ _id: categoryId });
    let getBrand;
    if (brandId) {
      getBrand = await Brand.findById({ _id: brandId });
    }

    if (!getCategory) {
      return ResourceDataWithImage(
        false,
        404,
        "Kategori tidak ditemukan",
        "../../uploads/products",
        uploadImage,
        res
      );
    }

    if (brandId) {
      if (!getBrand) {
        return ResourceDataWithImage(
          false,
          404,
          "Merk tidak ditemukan",
          "../../uploads/products",
          uploadImage,
          res
        );
      }
    }

    const product = await Product.findById({ _id: productId }).select("-__v");

    if (!product) {
      return ResourceDataWithImage(
        false,
        404,
        "Produk tidak ditemukan",
        "../../uploads/products",
        uploadImage,
        res
      );
    }

    if (product.code !== code) {
      product.code = code;
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.categoryId = categoryId;
    if (brandId) {
      product.brandId = brandId;
    }
    product.stock = stock;
    if (minimumStock) {
      product.minimumStock = minimumStock;
    }

    product.variants = variants
      ? variants.map((variant: any) => ({
          variantId: new mongoose.Types.ObjectId(),
          variantName: variant.variantName,
          variantPrice: variant.variantPrice,
          variantStock: variant.variantStock,
          isDeleted: 0,
          createdAt: Date.now(),
        }))
      : [];

    await product.save();

    if (uploadImage) {
      if (product.imageProduct) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads/products",
          product.imageProduct
        );

        if (fs.existsSync(oldImagePath)) {
          try {
            await fsPromises.unlink(oldImagePath);
            product.imageProduct = uploadImage;
          } catch (error: any) {
            return res.status(500).json({ message: error.message });
          }
        } else {
          product.imageProduct = uploadImage;
        }
      }
      product.imageProduct = uploadImage;
    }

    const updatedAll = await product.save();

    res
      .status(200)
      .json({ message: "Update data produk berhasil", data: updatedAll });
  } catch (error: any) {
    console.log("img nih", uploadImage);
    ResourceDataWithImage(
      false,
      500,
      error.message,
      "../../uploads/products",
      uploadImage,
      res
    );
  }
};

// CATEGORY

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

// BRAND

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
