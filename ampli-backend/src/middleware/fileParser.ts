import { RequestHandler } from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const avatarFileParser: RequestHandler = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      return res.status(422).json({ error: err.message });
    }
    next();
  });
};

export const audioFileParser: RequestHandler = (req, res, next) => {
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
