import express, { Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import multer from "multer";
import path = require("path");
import productRouter from "./routes/productRoute";

dotenv.config();

const app: Application = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  "/uploads/users/avatars",
  express.static(path.join(__dirname, "../uploads/users/avatars"))
);

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRouter);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
