// config/multer.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 업로드 폴더 지정
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // 파일명 충돌 방지: timestamp + 원본 확장자
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

export default upload;
