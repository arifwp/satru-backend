import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import authRouter from "./routes/authRoute";
import productRouter from "./routes/productRoute";
import userRoute from "./routes/userRoute";
import path = require("path");
import outletRouter from "./routes/outletRoute";
import typeOutletRouter from "./routes/typeOutletRoute";
import cors from "cors";
import brandRouter from "./routes/brandRoute";
import categoryRouter from "./routes/categoryRoute";

dotenv.config();

const app: Application = express();
const upload = multer();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:3001", // Ganti dengan asal aplikasi React.js Anda
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// MIDDLEWARE
// Middleware for parsing application/json
app.use(express.json());
// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../uploads/products"))
);

app.use(
  "/uploads/users/avatars",
  express.static(path.join(__dirname, "../uploads/users/avatars"))
);

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/outlet", outletRouter);
app.use("/api/v1/typeOutlet", typeOutletRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
