import { Request, Response } from "express";
import mongoose, { mongo } from "mongoose";
import Member from "../models/memberModel";
import Outlet from "../models/outletModel";

export const createMember = async (req: Request, res: Response) => {
  const { ownerId, userId, name, phone, bornDate } = req.body;
  const finalPhone = `62${phone}`;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Format ID user tidak benar" });
  }

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res
      .status(400)
      .json({ status: false, message: "Format ID owner tidak benar" });
  }

  if (phone[0] !== "8") {
    return res
      .status(400)
      .json({ status: false, message: "Format nomor whatsapp salah" });
  }

  try {
    const newMember = new Member({
      ownerId: ownerId,
      assignedBy: userId,
      name: name,
      phone: finalPhone,
      bornDate: bornDate,
      totalTransaction: 0,
      createdAt: Date.now(),
    });

    await newMember.save();

    res.status(201).json({
      status: true,
      message: `${name} berhasil ditambahkan sebagai member`,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  const { ownerId, userId, memberId, name, phone, bornDate } = req.body;
  const finalPhone = `62${phone}`;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Format ID user tidak benar" });
  }

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res
      .status(400)
      .json({ status: false, message: "Format ID owner tidak benar" });
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return res
      .status(400)
      .json({ status: false, message: "Format ID owner tidak benar" });
  }

  if (phone[0] !== "8") {
    return res
      .status(400)
      .json({ status: false, message: "Format nomor whatsapp salah" });
  }

  try {
    const getMember = await Member.findById({ _id: memberId });
    if (!getMember) {
      return res
        .status(404)
        .json({ status: false, message: "Member tidak ditemukan" });
    }

    const update = {
      name: name,
      phone: finalPhone,
      bornDate: bornDate,
    };

    const updatedMember = await Member.findByIdAndUpdate(memberId, update, {
      new: true,
    });

    res.status(200).json({
      status: true,
      message: "Berhasil mengubah data member",
      data: updatedMember,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const detailMember = async (req: Request, res: Response) => {
  const { memberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return res
      .status(500)
      .json({ status: false, message: "Member id tidak valid" });
  }

  try {
    const member = await Member.findById({ _id: memberId });

    if (!member) {
      return res
        .status(404)
        .json({ status: false, message: "Member tidak ditemukan" });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan data diskon",
      data: member,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllMember = async (req: Request, res: Response) => {
  const { ownerId, page = 1, limit = 10, search = "" } = req.body;
  try {
    const matchStage: any = {
      $match: {
        ownerId: new mongoose.Types.ObjectId(ownerId),
        isDeleted: 0,
        name: { $regex: search, $options: "i" },
      },
    };

    const member = await Member.aggregate([
      matchStage,
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalItems: [{ $count: "count" }],
        },
      },
    ]);

    const totalItems = member[0].totalItems[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan diskon",
      data: member[0].data,
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

export const deleteMember = async (req: Request, res: Response) => {
  const { memberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return res
      .status(400)
      .json({ status: false, message: "Diskon id tidak valid" });
  }

  try {
    const member = await Member.findById({ _id: memberId, isDeleted: 0 });

    if (!member) {
      return res
        .status(404)
        .json({ status: false, message: "Member tidak ditemukan" });
    }

    await Member.findByIdAndUpdate(memberId, { isDeleted: 1 }, { new: true });

    return res
      .status(200)
      .json({ status: true, message: "Berhasil menghapus member" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
