/*
  Warnings:

  - The primary key for the `product_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_image_id_fkey";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "image_id" DROP NOT NULL,
ALTER COLUMN "image_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "product_image_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "product_image"("name") ON DELETE CASCADE ON UPDATE CASCADE;
