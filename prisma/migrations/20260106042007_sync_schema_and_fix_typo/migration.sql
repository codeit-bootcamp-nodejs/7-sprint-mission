/*
  Warnings:

  - You are about to drop the column `updatedAet` on the `Product` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "updatedAet",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
