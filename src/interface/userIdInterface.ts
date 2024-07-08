import { Request } from "express";

export interface userIdInterface extends Request {
  userId?: string;
}
