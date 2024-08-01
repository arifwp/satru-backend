import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Outlet from "../models/outletModel";
import User from "../models/userModel";
import emailService from "../services/emailService";
import { confirmEmailRegistration } from "../utils/emailTemplate";
import { createToken } from "../utils/jwt";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password, owner, bornDate } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 8);
  const hashedEmail = await bcryptjs.hash(email, 8);
  const finalPhone = `62${phone}`;

  if (phone[0] !== "8") {
    return res
      .status(400)
      .json({ status: false, message: "Format nomor whatsapp salah" });
  }

  try {
    const newUser = new User({
      name: name,
      email: email,
      phone: finalPhone,
      password: hashedPassword,
      owner: owner,
      bornDate: bornDate,
      status: 1,
      created_at: Date.now(),
    });

    const saveUser = await newUser.save();

    const url = `${process.env.FRONTEND_URL_DEV}/emailConfirmation/${saveUser._id}/${hashedEmail}`;

    const emailResult = await emailService.sendEmail(
      email,
      "Verifikasi Akun SATRU",
      confirmEmailRegistration(name, url)
    );

    if (emailResult.statusSendEmail) {
      res.status(201).json({
        status: true,
        message:
          "Kami telah mengirim link aktivasi ke email anda, periksa spam/kotak masuk email anda",
      });
    } else {
      res.status(500).json({
        status: true,
        message: "Pendaftaran gagal, coba lagi nanti",
        data: emailResult.error,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Email tidak terdaftar" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Kata sandi salah" });
    }

    if (user.status === 2) {
      return res.status(403).json({
        status: false,
        message: `Email ${user.email} telah di blokir admin`,
      });
    } else if (user.status === 3) {
      return res.status(200).json({
        status: true,
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

    const dataUser = await User.findByIdAndUpdate(user._id, update, {
      new: true,
    }).select("-password");

    const outlet = await Outlet.find({ ownerId: user._id });

    const finalRes = {
      dataUser,
      outlet,
    };

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 86400,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      status: true,
      message: "Login berhasil",
      data: finalRes,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

    res.status(200).json({ status: true, message: "Logout berhasil" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const accountVerification = async (req: Request, res: Response) => {
  const { userId, hashedEmail } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User tidak ditemukan" });
    }

    const isEmailValid = await bcryptjs.compare(hashedEmail, user.email);

    if (!isEmailValid) {
      return res
        .status(400)
        .json({ status: false, message: "Email user tidak valid" });
    }

    const update = { isVerified: 1, updatedAt: Date.now() };
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    res.status(200).json({
      status: true,
      message: `Akun ${user.email} telah aktif sepenuhnya`,
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};
