import { buildImageUrl } from "../services/uploadService.js";

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "image 파일이 필요합니다." });
  }

  const url = buildImageUrl(req, req.file);

  res.status(201).json({ url });
};
