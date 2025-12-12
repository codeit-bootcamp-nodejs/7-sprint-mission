export const uploadSingleImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "이미지가 업로드되지 않았습니다." });
  }
  console.log("업로드된 파일: ", req.file);
  console.log("기타 폼 데이터: ", req.body);
  res.json({
    message: "이미지 업로드 성공",
    filePath: `/upload/${req.file.filename}`,
  });
};
