import { RequestHandler } from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const fileParser: RequestHandler = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      return res.status(422).json({ error: err.message });
    }
    next();
  });
};

export default fileParser;
