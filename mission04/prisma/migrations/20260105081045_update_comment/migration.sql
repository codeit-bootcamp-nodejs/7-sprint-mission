/*
  Warnings:

  - You are about to drop the column `board_id` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "board_id",
ALTER COLUMN "post_id" DROP NOT NULL,
ALTER COLUMN "product_id" DROP NOT NULL;
