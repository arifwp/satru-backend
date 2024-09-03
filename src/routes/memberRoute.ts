import express from "express";
import {
  createMember,
  deleteMember,
  detailMember,
  getAllMember,
  updateMember,
} from "../controllers/memberController";
import { authMiddlewware } from "../middlewares/authMiddleware";

const memberRouter = express.Router();

memberRouter.post("/createMember", authMiddlewware, createMember);
memberRouter.post("/getAllMember", authMiddlewware, getAllMember);
memberRouter.put("/updateMember", authMiddlewware, updateMember);
memberRouter.get(
  "/detailMember/:memberId/:ownerId",
  authMiddlewware,
  detailMember
);
memberRouter.delete("/deleteMember/:memberId", authMiddlewware, deleteMember);

export default memberRouter;
