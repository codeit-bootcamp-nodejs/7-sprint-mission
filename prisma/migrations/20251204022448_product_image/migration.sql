/*
  Warnings:

  - You are about to drop the column `image_id` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image_name]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_image_id_fkey";

-- DropIndex
DROP INDEX "product_image_id_key";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "image_id",
ADD COLUMN     "image_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_image_name_key" ON "product"("image_name");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_image_name_fkey" FOREIGN KEY ("image_name") REFERENCES "product_image"("name") ON DELETE CASCADE ON UPDATE CASCADE;
