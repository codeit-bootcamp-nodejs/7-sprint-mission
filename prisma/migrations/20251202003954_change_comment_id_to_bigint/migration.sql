/*
  Warnings:

  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "comment" DROP CONSTRAINT "comment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("id");
