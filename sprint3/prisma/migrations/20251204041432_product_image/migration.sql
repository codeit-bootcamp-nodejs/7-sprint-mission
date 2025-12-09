/*
  Warnings:

  - You are about to drop the column `image_name` on the `product` table. All the data in the column will be lost.
  - The primary key for the `product_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[image_id]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `product_image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_image_name_fkey";

-- DropIndex
DROP INDEX "product_image_name_key";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "image_name",
ADD COLUMN     "image_id" BIGINT;

-- AlterTable
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "product_image_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_image_id_key" ON "product"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_image_name_key" ON "product_image"("name");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "product_image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
