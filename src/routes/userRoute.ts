import express from "express";
import {
  deleteUser,
  getDetailUser,
  updateUser,
  confirmEmailChange,
  changeEmail,
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
userRoute.post("/confirmEmailChange", authMiddlewware, confirmEmailChange);
userRoute.put("/changeEmail", authMiddlewware, changeEmail);
userRoute.delete("/deleteUser/:userId", authMiddlewware, deleteUser);

export default userRoute;
