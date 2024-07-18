import { Request, Response } from "express";
import Category from "../models/categoryModel";

export const createCategory = async (req: Request, res: Response) => {
  const { name, ownerId } = req.body;

  try {
    const newCategory = new Category({
      ownerId: ownerId,
      name: name,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const category = await newCategory.save();
    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan kategori",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllCategory = async (req: Request, res: Response) => {
  const ownerId = req.params.ownerId;

  try {
    const category = await Category.find({ isDeleted: 0, ownerId: ownerId });
    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan semua data kategori",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const brand = await Category.find({ _id: categoryId, isDeleted: 0 });
    if (!brand) {
      return res
        .status(400)
        .json({ status: false, message: "Kategori tidak ditemukan" });
    }

    const update = { isDeleted: 1 };

    await Category.findByIdAndUpdate(categoryId, update, { new: true });
    res
      .status(200)
      .json({ status: true, message: "Berhasil menghapus kategori" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
