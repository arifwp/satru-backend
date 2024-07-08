import express from "express";
import { login, logout, register } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout/:userId", logout);

export default authRouter;
