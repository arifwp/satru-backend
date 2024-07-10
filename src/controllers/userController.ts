import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import User from "../models/userModel";
import { ResourceDataWithImage } from "../utils/resource";

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

    if (user.status !== 1) {
      return res
        .status(402)
        .json({ status: false, message: "User di nonaktifkan" });
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
  const uploadAvatar = req.file?.filename;
  const isObjectId = mongoose.Types.ObjectId.isValid(userId);
  if (!isObjectId) {
    return ResourceDataWithImage(
      false,
      400,
      "Id user tidak valid",
      "../../uploads/users/avatars",
      uploadAvatar,
      res
    );
  }

  const { name, bornDate } = req.body;

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -token -__v"
    );
    if (!user) {
      return ResourceDataWithImage(
        false,
        404,
        "User tidak ditemukan",
        "../../uploads/users/avatars",
        uploadAvatar,
        res
      );
    }

    user.name = name;
    user.bornDate = bornDate;
    user.updatedAt = new Date(Date.now());
    await user.save();

    if (uploadAvatar) {
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
            user.avatar = uploadAvatar;
          } catch (error: any) {
            return ResourceDataWithImage(
              false,
              500,
              error.message,
              "../../uploads/users/avatars",
              uploadAvatar,
              res
            );
          }
        } else {
          user.updatedAt = new Date(Date.now());
          user.avatar = uploadAvatar;
        }
      }
      user.avatar = uploadAvatar;
    }

    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Update data user berhasil", data: updatedUser });
  } catch (error: any) {
    ResourceDataWithImage(
      false,
      500,
      error.message,
      "../../uploads/users/avatars",
      uploadAvatar,
      res
    );
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
