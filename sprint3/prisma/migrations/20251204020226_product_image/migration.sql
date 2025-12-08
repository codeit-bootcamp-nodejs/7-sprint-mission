/*
  Warnings:

  - Added the required column `name` to the `product_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `product_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_image" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
