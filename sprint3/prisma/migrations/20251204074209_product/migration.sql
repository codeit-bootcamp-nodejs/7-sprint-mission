/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_id" BIGINT,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "product_image" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_image_name_key" ON "product_image"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_image_id_key" ON "Product"("image_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "product_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
