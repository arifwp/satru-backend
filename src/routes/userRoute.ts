import express from "express";
import { authMiddlewware } from "../middlewares/authMiddleware";
import {
  deleteUser,
  getDetailUser,
  updateAvatar,
  updateUser,
} from "../controllers/userController";
import { configUploadAvatar } from "../middlewares/uploadMiddleware";

const userRoute = express.Router();

userRoute.get("/getDetailUser/:userId", authMiddlewware, getDetailUser);
userRoute.put("/updateUser/:userId", authMiddlewware, updateUser);
userRoute.put(
  "/updateAvatar/:userId",
  authMiddlewware,
  configUploadAvatar,
  updateAvatar
);
userRoute.delete("/deleteUser/:userId", authMiddlewware, deleteUser);

export default userRoute;
