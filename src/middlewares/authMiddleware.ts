import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userIdInterface } from "../interface/userIdInterface";

export const authMiddlewware = (
  req: userIdInterface,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Tidak ada token, izin ditolak" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Token sudah expired/tidak valid" });
  }
};
