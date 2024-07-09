import express from "express";
import {
  deleteUser,
  getDetailUser,
  updateUser,
} from "../controllers/userController";
import { authMiddlewware } from "../middlewares/authMiddleware";
import { configUploadAvatar } from "../middlewares/uploadMiddleware";

const userRoute = express.Router();

userRoute.get("/getDetailUser/:userId", authMiddlewware, getDetailUser);
userRoute.put(
  "/updateUser/:userId",
  authMiddlewware,
  configUploadAvatar,
  updateUser
);
userRoute.delete("/deleteUser/:userId", authMiddlewware, deleteUser);

export default userRoute;
