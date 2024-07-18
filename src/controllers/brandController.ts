import { Request, Response } from "express";
import Brand from "../models/brandModel";

export const createBrand = async (req: Request, res: Response) => {
  const { name, ownerId } = req.body;

  try {
    const newBrand = new Brand({
      ownerId: ownerId,
      name: name,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const brand = await newBrand.save();
    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan merk",
      data: brand,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllBrand = async (req: Request, res: Response) => {
  const { ownerId } = req.params;

  try {
    const brand = await Brand.find({ isDeleted: 0, ownerId: ownerId });
    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan semua data merk",
      data: brand,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { brandId } = req.params;
  try {
    const brand = await Brand.find({ _id: brandId, isDeleted: 0 });
    if (!brand) {
      return res
        .status(400)
        .json({ status: false, message: "Merk tidak ditemukan" });
    }

    const update = { isDeleted: 1 };

    await Brand.findByIdAndUpdate(brandId, update, { new: true });
    res.status(200).json({ status: true, message: "Berhasil menghapus brand" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
