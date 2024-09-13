import { Request, Response } from "express";
import Discount from "../models/discountModel";
import mongoose from "mongoose";
import User from "../models/userModel";
import Outlet from "../models/outletModel";

export const createDiscount = async (req: Request, res: Response) => {
  const { ownerId, outletId, name, discountType, discount, expiredDate } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res
      .status(500)
      .json({ status: false, message: "Owner id tidak valid" });
  }

  try {
    const getOwner = await User.findById({ _id: ownerId });
    if (!getOwner) {
      return res
        .status(404)
        .json({ status: false, message: "User tidak ditemukan" });
    }

    const newDiscount = new Discount({
      ownerId: ownerId,
      outletId: outletId,
      name: name,
      discountType: discountType,
      discount: discount,
      expiredDate: expiredDate,
      isDeleted: 0,
      createdAt: new Date(Date.now()),
    });

    await newDiscount.save();

    res.status(201).json({ status: true, message: "Diskon berhasil dibuat" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateDiscount = async (req: Request, res: Response) => {
  const {
    discountId,
    ownerId,
    outletId,
    name,
    discountType,
    discount,
    expiredDate,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res
      .status(500)
      .json({ status: false, message: "Owner id tidak valid" });
  }

  try {
    const getOwner = await User.findById({ _id: ownerId });
    const getDiscount = await Discount.findById({
      _id: discountId,
      isDeleted: 0,
    });
    if (!getOwner) {
      return res
        .status(404)
        .json({ status: false, message: "User tidak ditemukan" });
    }

    if (!getDiscount) {
      return res
        .status(404)
        .json({ status: false, message: "Diskon tidak ditemukan" });
    }

    const update = {
      outletId: outletId,
      name: name,
      discountType: discountType,
      discount: discount,
      expiredDate: expiredDate,
    };

    const updatedDiscount = await Discount.findByIdAndUpdate(
      discountId,
      update,
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Diskon berhasil diubah",
      data: updatedDiscount,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const detailDiscount = async (req: Request, res: Response) => {
  const { ownerId, discountId } = req.params;

  try {
    const user = await User.findById({ _id: ownerId });

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Tidak dapat menemukan data" });
    }

    const discount = await Discount.findById({ _id: discountId });

    if (!discount) {
      return res
        .status(404)
        .json({ status: false, message: "Tidak dapat menemukan data" });
    }

    const discountObj = discount.toObject();

    let ids;
    const defineIds = discount.outletId.map((item: any) => item);
    const outletIds =
      defineIds && defineIds.length
        ? defineIds.map((id: string) => new mongoose.Types.ObjectId(id))
        : [];

    const outlet = await Outlet.aggregate([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          _id: {
            $in:
              outletIds &&
              (outletIds as []).map(
                (id: string) => new mongoose.Types.ObjectId(id)
              ),
          },
        },
      },
    ]);

    Object.assign(discountObj, { outlet: outlet });

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan detail diskon",
      data: discountObj,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllDiscount = async (req: Request, res: Response) => {
  const { ownerId, outletIds, page = 1, limit = 10, search = "" } = req.body;

  try {
    const matchStage: any = {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        isDeleted: 0,
        name: { $regex: search, $options: "i" },
      },
    };

    if (outletIds && outletIds.length > 0) {
      const ids = outletIds.split(",");
      matchStage.$match.outletId = { $in: ids };
    }

    const discounts = await Discount.aggregate([
      matchStage,
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalItems: [{ $count: "count" }],
        },
      },
    ]);

    const totalItems = discounts[0].totalItems[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan diskon",
      data: discounts[0].data,
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

export const deleteDiscount = async (req: Request, res: Response) => {
  const discountId = req.params.discountId;

  if (!mongoose.Types.ObjectId.isValid(discountId)) {
    return res
      .status(400)
      .json({ status: false, message: "Diskon id tidak valid" });
  }

  try {
    const discount = await Discount.findById({ _id: discountId, isDeleted: 0 });
    if (!discount) {
      return res
        .status(200)
        .json({ status: false, message: "Diskon tidak ditemukan" });
    }

    const update = { isDeleted: 1 };
    await Discount.findByIdAndUpdate(discountId, update, { new: true });

    res.status(200).json({ status: true, message: "Diskon berhasil dihapus" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
