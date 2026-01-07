-- DropForeignKey
ALTER TABLE "article_comment" DROP CONSTRAINT "article_comment_article_id_fkey";

-- DropForeignKey
ALTER TABLE "product_comment" DROP CONSTRAINT "product_comment_product_id_fkey";

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
