import { PrismaClient } from "@prisma/client";
import { triggerAsyncId } from "async_hooks";
import { title } from "process";

const prisma = new PrismaClient();

export async function getAllArticles(req, res) {
  const articles = await prisma.article.findMany();
  console.log(articles);

  res.send(articles);
}

export async function createArticle(req, res) {
  const body = req.body;

  const newArticle = await prisma.article.create({
    data: {
      title: body.title,
      content: body.content,
      tags: body.tags,
    },
  });
}

// 모든 상품 조회
export async function getAllProducts(req, res) {
  const products = await prisma.product.findMany();
  console.log(products);

  res.send(products);
}

// 상품 생성
export async function createProduct(req, res) {
  const body = req.body;

  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category,
      tags: body.tags,
    },
  });

  res.send(newProduct);
}
