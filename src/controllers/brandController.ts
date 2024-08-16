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
  const { ownerId, search = "", page = 1, limit = 10 } = req.body;

  try {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, "i");

    const totalItems = await Brand.countDocuments({
      isDeleted: 0,
      ownerId: ownerId,
      name: { $regex: searchRegex },
    });

    const brands = await Brand.find({
      isDeleted: 0,
      ownerId: ownerId,
      name: { $regex: searchRegex },
    })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan semua data merk",
      data: brands,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { brandId } = req.params;

  try {
    const brand = await Brand.findOne({ _id: brandId, isDeleted: 0 });

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
