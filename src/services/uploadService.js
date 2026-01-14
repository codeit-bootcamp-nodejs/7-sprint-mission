export const buildImageUrl = (req, file) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${file.filename}`;
};
