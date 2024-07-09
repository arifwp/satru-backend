import multer, { FileFilterCallback } from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = (destination: string) =>
  multer.diskStorage({
    destination: `uploads/${destination}`,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueSuffix);
    },
  });

const imgFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Hanya file dengan format jpg, jpeg, dan png yang diterima")
    );
  }
  cb(null, true);
};

export const configUploadAvatar = multer({
  storage: storage("users/avatars"),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imgFilter,
}).single("avatar");

export const configUploadProductImages = multer({
  storage: storage("products"),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imgFilter,
}).single("imageProduct");
