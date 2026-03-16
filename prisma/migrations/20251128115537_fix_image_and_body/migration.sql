-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "image" TEXT,
ALTER COLUMN "body" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT;
