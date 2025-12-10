import { Router } from "express";
import { prisma } from "../../prisma/prisma.js";
import multer from "multer";

const router = Router({ mergeParams: true });
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    console.log("파일 정보: ", req.file);
    console.log("path 경로: ", req.file.path);
    console.log("body 정보", req.body);
    console.log("params 정보", req.params);

    const uploadData = await prisma.product_image.create({
      data: {
        path: req.file.path,
        product_id: Number(req.params.productId),
      },
    });
    console.log("===========");
    console.log(uploadData);
    res.json({ message: "insert ok" });
  } catch (e) {
    next(e);
  }
});

router.patch("/", upload.single("image"), async (req, res, next) => {
  try {
    const uploadData = await prisma.product_image.update({
      where: {
        product_id: Number(req.params.productId),
      },
      data: {
        path: req.file.path,
        product_id: Number(req.params.productId),
      },
    });
    console.log("===========");
    console.log(uploadData);
    res.json({ message: "update ok" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:imageId", upload.single("image"), async (req, res, next) => {
  try {
    const uploadData = await prisma.product_image.delete({
      where: {
        id: Number(req.params.imageId),
      },
    });

    res.json({ message: "delete ok" });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const imageData = await prisma.product_image.findMany();
    console.log(imageData);

    res.json({ message: "조회 성공" });
  } catch (e) {
    next(e);
  }
});

export default router;
