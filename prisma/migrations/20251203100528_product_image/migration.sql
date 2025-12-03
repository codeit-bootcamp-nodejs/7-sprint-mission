/*
  Warnings:

  - A unique constraint covering the columns `[image_id]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "image_id" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "product_image" (
    "id" BIGSERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_image_id_key" ON "product"("image_id");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "product_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
