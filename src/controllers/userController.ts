import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import Otp from "../models/otpMode";
import User from "../models/userModel";
import emailService from "../services/emailService";
import { changeEmailTemplateMessage } from "../utils/emailTemplate";
import { ResourceDataWithImage } from "../utils/resource";
import moment from "moment";
import "moment-timezone";

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
    return res.status(400).json({ message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById({ _id: userId }).select(
      "-password -token -__v"
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
    } else {
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

export const confirmEmailChange = async (req: Request, res: Response) => {
  const { userId, oldEmail, newEmail } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(402).json({ message: "Id user tidak valid" });
  }

  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(402).json({ message: "User tidak ditemukan" });
    }

    const findEmail = await User.findOne({ email: newEmail });
    if (findEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000);

    // insert otp to db
    const newOtp = new Otp({
      userId: userId,
      otpCode: otpCode,
      oldEmail: oldEmail,
      newEmail: newEmail,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      createdAt: Date.now(),
    });

    await newOtp.save();

    const convertDate: moment.Moment = moment(
      new Date(Date.now() + 5 * 60 * 1000)
    );
    const timezone: string = "Asia/Jakarta";
    const localizedDate: moment.Moment = convertDate.tz(timezone);
    const formattedDate: string = localizedDate.format("YYYY-MM-DD HH:mm:ss");

    // send otp to email
    const emailResult = await emailService.sendEmail(
      oldEmail,
      "Ganti Email",
      changeEmailTemplateMessage(user.name, otpCode, formattedDate)
    );

    if (emailResult.statusSendEmail) {
      return res.status(200).json({
        message:
          "Kami mengirimkan kode otp anda dalam email, periksa folder spam dan kotak masuk anda",
        data: emailResult.info,
      });
    } else {
      return res.status(500).json({
        message: "Gagal mengganti email, coba lagi nanti",
        data: emailResult.error,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changeEmail = async (req: Request, res: Response) => {
  const { userId, otpCode, newEmail } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(402).json({ message: "Id user tidak valid" });
  }

  try {
    const findOtp = await Otp.findOne({ userId: userId, otpCode: otpCode })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!findOtp) {
      return res
        .status(400)
        .json({ message: "Kode otp yang anda masukkan tidak valid" });
    }

    if (otpCode !== findOtp.otpCode) {
      return res.status(400).json({ message: "Kode otp tidak valid" });
    }

    if (newEmail !== findOtp.newEmail) {
      return res
        .status(400)
        .json({ message: "Request email baru tidak ditemukan di database" });
    }

    console.log(findOtp.expiredAt);

    if (new Date(findOtp.expiredAt) < new Date()) {
      return res.status(400).json({ message: "Kode otp anda sudah expired" });
    }

    const update = { updatedAt: Date.now(), email: newEmail };
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-password -token -__v");

    // delete otp
    await Otp.deleteMany({ userId: userId });

    res.status(200).json({
      message: `Berhasil mengubah email ke ${newEmail}`,
      data: updatedUser,
    });
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
