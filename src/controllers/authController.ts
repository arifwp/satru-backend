import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/userModel";
import { createToken } from "../utils/jwt";
import mongoose from "mongoose";

export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password, owner, bornDate } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 8);

  try {
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      owner: owner,
      bornDate: bornDate,
      status: 1,
      created_at: Date.now(),
    });

    await newUser.save();
    res.status(201).json({ message: "Pendaftaran berhasil" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Kata sandi salah" });
    }

    if (user.status === 2) {
      return res
        .status(403)
        .json({ message: `Email ${user.email} telah di blokir admin` });
    } else if (user.status === 3) {
      return res.status(200).json({
        message:
          "Anda telah menonaktifkan akun anda sebelumnya, apakah anda yakin ingin mengaktifkannya kembali?",
        data: user,
      });
    }

    const token = createToken(user._id as string);
    const update = {
      lastLogin: Date.now(),
      token: token,
    };

    const updateUser = await User.findByIdAndUpdate(user._id, update, {
      new: true,
    }).select("-password");

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Login berhasil",
      data: updateUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const isObjectId = mongoose.Types.ObjectId.isValid(userId);
  if (!isObjectId) {
    return res.status(404).json({ message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const update = {
      token: null,
    };
    await User.findByIdAndUpdate(user._id, update, {
      new: true,
    });

    res.cookie("jwt", "", { maxAge: 1 });

    res.status(200).json({ message: "Logout berhasil" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
