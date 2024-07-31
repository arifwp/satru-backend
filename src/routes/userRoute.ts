import express from "express";
import {
  deleteUser,
  getDetailUser,
  updateUser,
  confirmEmailChange,
  changeEmail,
  confirmWhatsappChange,
  changeWhatsapp,
  changePassword,
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

userRoute.post(
  "/confirmWhatsappChange",
  authMiddlewware,
  confirmWhatsappChange
);
userRoute.put("/changeWhatsapp", authMiddlewware, changeWhatsapp);
userRoute.put("/changePassword", authMiddlewware, changePassword);

userRoute.delete("/deleteUser/:userId", authMiddlewware, deleteUser);

export default userRoute;
