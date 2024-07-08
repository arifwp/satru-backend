import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import User from "../models/userModel";

const fsPromises = fs.promises;

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, owner, avatar } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 8);

    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      owner: owner,
      status: 1,
      avatar: avatar,
      created_at: Date.now(),
    });

    await newUser.save();
    res.status(201).json({ message: "Sukses menambahkan user baru" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetailUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const isObjectId = mongoose.Types.ObjectId.isValid(userId);
  if (!isObjectId) {
    return res.status(404).json({ message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -token"
    );
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json({
      message: "Detail user berhasil ditampilkan",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const isObjectId = mongoose.Types.ObjectId.isValid(userId);
  if (!isObjectId) {
    return res.status(400).json({ message: "Id user tidak valid" });
  }

  const { name, bornDate } = req.body;

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -token -__v"
    );
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    user.name = name;
    user.bornDate = bornDate;
    user.updatedAt = new Date(Date.now());
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Update data user berhasil", data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const isObjectId = mongoose.Types.ObjectId.isValid(userId);
  if (!isObjectId) {
    return res.status(400).json({ message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -token -__v"
    );
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (req.file) {
      if (user.avatar) {
        const oldAvatarPath = path.join(
          __dirname,
          "../../uploads/users/avatars",
          user.avatar
        );

        if (fs.existsSync(oldAvatarPath)) {
          try {
            await fsPromises.unlink(oldAvatarPath);
            user.updatedAt = new Date(Date.now());
            user.avatar = req.file.filename;
          } catch (error: any) {
            return res.status(500).json({ message: error.message });
          }
        } else {
          user.updatedAt = new Date(Date.now());
          user.avatar = req.file.filename;
        }
      }
      user.avatar = req.file.filename;
    } else {
      return res.status(400).json({ message: "Tidak ada file image" });
    }

    const updatedAvatar = await user.save();

    res
      .status(200)
      .json({ message: "Update data user berhasil", data: updatedAvatar });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const isObjectId = mongoose.Types.ObjectId.isValid(userId);
  if (!isObjectId) {
    return res.status(402).json({ message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.avatar) {
      const avatarPath = path.join(
        __dirname,
        "../../uploads/users/avatars",
        user.avatar
      );
      try {
        await fsPromises.unlink(avatarPath);
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Data user berhasil dihapuss" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
