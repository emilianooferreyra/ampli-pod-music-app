import { RequestHandler } from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para parsear múltiples campos de archivo
const fileParser: RequestHandler = (req, res, next) => {
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(422).json({ error: err.message });
    }
    next();
  });
};

export default fileParser;
