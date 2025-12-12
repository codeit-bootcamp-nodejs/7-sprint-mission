-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updated_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "product_comment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "product_id" BIGINT NOT NULL,

    CONSTRAINT "product_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_comment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "article_id" BIGINT NOT NULL,

    CONSTRAINT "article_comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
