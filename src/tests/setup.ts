import { prismaClient } from "../lib/prismaClient";

afterAll(async () => {
  await prismaClient.$disconnect();
});

beforeEach(async () => {
  await prismaClient.like.deleteMany();
  await prismaClient.comment.deleteMany();
  await prismaClient.article.deleteMany();
  await prismaClient.user.deleteMany();
});