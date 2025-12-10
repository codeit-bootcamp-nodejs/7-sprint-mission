import { Router } from "express";
import multer from "multer";
import { BadRequestError } from "../errors/customError.js";
import path from "path";

const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const fs = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(
        new BadRequestError("jpg, jpeg, png, gif 포맷만 가능합니다"),
        false
      );
    }
    cb(null, true);
  },
});

//image = 클라이언트 <input type="file" name="image" /> 태그 name 값
router.post("/image", fs.single("image"), (req, res, next) => {
  try {
    console.log("파일 정보:", req.file);
    console.log("일반 데이터:", req.body);

    res.json({ message: "upload ok" });
  } catch (e) {
    next(e);
  }
});

router.post("/images", fs.array("images", 3), (req, res, next) => {
  try {
    console.log("파일 정보:", req.files);
    console.log("파일 갯수:", req.files.length);
    console.log("일반 데이터:", req.body);

    res.json({ message: "upload ok" });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/photos",
  fs.fields([
    { name: "photo1", maxCount: 1 },
    { name: "photo2", maxCount: 3 },
  ]),
  (req, res, next) => {
    try {
      console.log("파일 정보:", req.files);
      console.log("파일 갯수:", req.files.length);
      console.log("일반 데이터:", req.body);

      res.json({ message: "upload ok" });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
