import { Request, Response } from "express";
import mongoose from "mongoose";
import Outlet from "../models/outletModel";
import User from "../models/userModel";
import TypeOutlet from "../models/typeOutletModel";

export const createOutlet = async (req: Request, res: Response) => {
  const { ownerId, name, estEmployee, address, typeId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res
      .status(400)
      .json({ status: false, message: "owner id tidak valid" });
  }

  if (!mongoose.Types.ObjectId.isValid(typeId)) {
    return res
      .status(400)
      .json({ status: false, message: "type id tidak valid" });
  }

  try {
    const user = await User.findById({ _id: ownerId });
    const typeOutlet = await TypeOutlet.findById({ _id: typeId });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Tidak dapat menemukan pemilik" });
    }

    if (!typeOutlet) {
      return res.status(404).json({
        status: false,
        message: "Tidak dapat menemukan tipe kategori",
      });
    }

    const newOutlet = new Outlet({
      ownerId: ownerId,
      name: name,
      estEmployee: estEmployee,
      address: address,
      typeId: typeId,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const outlet = await newOutlet.save();
    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan outlet baru",
      data: outlet,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateOutlet = async (req: Request, res: Response) => {
  const outletId = req.params.outletId;
  const { ownerId, name, estEmployee, address, type } = req.body;
  if (!mongoose.Types.ObjectId.isValid(outletId)) {
    return res
      .status(400)
      .json({ status: false, message: "Outlet id tidak valid" });
  }

  try {
    const outlet = await Outlet.findById({ _id: outletId });
    if (!outlet) {
      return res
        .status(400)
        .json({ status: false, message: "Outlet tidak ditemukan" });
    }

    if (outlet.isDeleted === 1) {
      return res
        .status(400)
        .json({ status: false, message: "Outlet di nonaktifkan" });
    }

    const updatedData = await Outlet.findByIdAndUpdate(outletId, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      message: "Berhasil update data outlet",
      data: updatedData,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const detailOutlet = async (req: Request, res: Response) => {
  const outletId = req.params.outletId;
  if (!mongoose.Types.ObjectId.isValid(outletId)) {
    return res
      .status(400)
      .json({ status: false, message: "Outlet id tidak valid" });
  }

  try {
    const outlet = await Outlet.findById({ _id: outletId });
    if (!outlet) {
      return res
        .status(400)
        .json({ status: false, message: "Outlet tidak ditemukan" });
    }

    if (outlet.isDeleted === 1) {
      return res
        .status(400)
        .json({ status: false, message: "Outlet anda di nonaktifkan" });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan data outlet",
      data: outlet,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllOutlet = async (req: Request, res: Response) => {
  const ownerId = req.params.ownerId;
  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res
      .status(400)
      .json({ status: false, message: "Owner id tidak valid" });
  }

  try {
    const outlet = await Outlet.find({ isDeleted: 0, ownerId: ownerId });

    if (!outlet) {
      return res
        .status(404)
        .json({ status: false, message: "Tidak ada data outlet" });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan data semua outlet",
      data: outlet,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteOutlet = async (req: Request, res: Response) => {
  const outletId = req.params.outletId;
  if (!mongoose.Types.ObjectId.isValid(outletId)) {
    return res
      .status(400)
      .json({ status: false, message: "Outlet id tidak valid" });
  }

  try {
    const outlet = await Outlet.findById({ _id: outletId });
    if (!outlet) {
      return res
        .status(400)
        .json({ status: false, message: "Outlet tidak ditemukan" });
    }

    if (outlet.isDeleted !== 0) {
      return res
        .status(400)
        .json({ status: false, message: "Outlet anda di nonaktifkan" });
    }

    const update = { isDeleted: 1 };

    await Outlet.findByIdAndUpdate(outletId, update, {
      new: true,
    });

    // await Outlet.findByIdAndDelete(outletId);

    res.status(200).json({
      status: true,
      message: "Berhasil menghapus outlet",
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
