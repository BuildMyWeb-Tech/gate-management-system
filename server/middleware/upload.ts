// Adapted from OTT middleware/upload.ts
// Removed: S3 upload functions
// Added: local disk storage with date-based subfolder
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Organise by date: uploads/2026-06-26/
    const dateFolder = new Date().toISOString().split("T")[0];
    const fullPath = path.join(UPLOAD_DIR, dateFolder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const MAX_MB = Number(process.env.MAX_FILE_SIZE_MB || 5);

export const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (_req: Request, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isAllowed =
      allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

export default upload;