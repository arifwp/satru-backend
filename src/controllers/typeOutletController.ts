import { Request, Response } from "express";
import mongoose from "mongoose";
import Outlet from "../models/outletModel";
import User from "../models/userModel";
import TypeOutlet from "../models/typeOutletModel";

export const createTypeOutlet = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const newType = new TypeOutlet({
      name: name,
      isDeleted: 0,
      createdAt: Date.now(),
    });

    const type = await newType.save();

    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan tipe outlet baru",
      data: type,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllTypeOutlet = async (req: Request, res: Response) => {
  try {
    const type = await TypeOutlet.find({ isDeleted: 0 });
    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan semua data tipe",
      data: type,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
