/*
  Warnings:

  - A unique constraint covering the columns `[image_id]` on the table `article` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "article" ADD COLUMN     "image_id" BIGINT;

-- CreateTable
CREATE TABLE "article_image" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "article_image_name_key" ON "article_image"("name");

-- CreateIndex
CREATE UNIQUE INDEX "article_image_id_key" ON "article"("image_id");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "article_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
