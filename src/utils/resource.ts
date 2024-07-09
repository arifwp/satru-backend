import { Response } from "express";
import fs from "fs";
import path from "path";

const fsPromises = fs.promises;

export const ResourceDataWithImage = async (
  status: boolean,
  errorCode: number,
  message: string,
  directory: string,
  img?: any,
  res?: Response
) => {
  if (img) {
    const avatarPath = path.join(__dirname, directory, img);
    try {
      await fsPromises.unlink(avatarPath);
      console.log("unlink succedd");
    } catch (error: any) {
      return res && res.status(500).json({ message: error.message });
    }
  }
  res && res.status(errorCode).json({ status: status, message: message });
};
