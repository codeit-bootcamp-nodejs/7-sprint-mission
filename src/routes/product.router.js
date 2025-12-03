import { prisma } from "../../prisma/prisma.js";
import { Router } from "express";
import { serializeBigInt } from "./serializeBigInt.js";

const router = Router();

//GET ITEM (req.query : ?name=computer&rpeice=10000 형태로 오는 값)
router.get("/search", async (req, res) => {
  try {
    const {
      id,
      name,
      price,
      description,
      tags,
      createdAt,
      orderBy,
      page,
      pageSize,
    } = req.query;
    const getDetailProduct = {};

    console.log("req : ", req.query);

    if (name && price) {
      getDetailProduct.name = { contains: name, mode: "insensitive" };
      getDetailProduct.price = Number(price);
    } else if (name && description) {
      getDetailProduct.name = { contains: name, mode: "insensitive" };
      getDetailProduct.description = {
        contains: description,
        mode: "insensitive",
      };
    } else if (name) {
      getDetailProduct.name = { contains: name, mode: "insensitive" };
    } else if (price) {
      getDetailProduct.price = Number(price);
    } else if (description) {
      getDetailProduct.description = {
        contains: description,
        mode: "insensitive",
      };
      console.log("getD : ", getDetailProduct);
    } else if (id) {
      getDetailProduct.id = Number(id);
    } else if (createdAt) {
      getDetailProduct.createdAt = createdAt;
    } else if (tags) {
      getDetailProduct.tags = {
        has: tags,
      };
    }

    const getItem = await prisma.product.findMany({
      where: getDetailProduct,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        tags: true,
        created_at: true,
      },
      orderBy: {
        created_at: orderBy,
      },
    });
    console.log(getItem);

    if (getItem.length === 0) {
      return res.status(404).json({
        message: "찾을 수 없는 키워드 입니다.",
      });
    }

    res.status(201).json({
      massage: "성공",
      product: serializeBigInt(getItem),
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Server Error" });
  }
});

//GET ALL
router.get("/", async (req, res) => {
  const { orderBy } = req.query;

  console.log("req.params: ", req.query);

  try {
    const getAll = await prisma.product.findMany({
      orderBy: {
        created_at: orderBy,
      },
    });
    res.json(serializeBigInt(getAll));
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Server Error" });
  }
});

//GET ID
router.get("/:id", async (req, res) => {
  try {
    const getId = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json(serializeBigInt(getId));
  } catch (error) {
    res.status(500).json({ error: "Serve Error" });
  }
});

//DELETE ID
router.delete("/:id", async (req, res) => {
  try {
    const deleteProduct = await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Delete Success!" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

//INSERT
router.post("/", async (req, res) => {
  try {
    const { name, price, description, tags } = req.body;
    const insertProduct = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        tags,
      },
    });
    res.status(201).json({
      massage: "insert ok!",
      product: serializeBigInt(insertProduct),
    });
  } catch (error) {
    res.status(500).json({ error: "INSERT ERROR!" });
  }
});

//PATCH
router.patch("/:id", async (req, res) => {
  try {
    const patchData = req.body;

    const patchProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: patchData,
    });

    res.status(201).json({
      massage: "수정 완료",
      product: serializeBigInt(patchProduct),
    });
  } catch (error) {
    res.status(500).json({ massage: "Server Error" });
  }
});

export default router;
