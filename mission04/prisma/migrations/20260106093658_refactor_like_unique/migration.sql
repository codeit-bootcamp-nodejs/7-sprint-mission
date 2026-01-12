/*
  Warnings:

  - A unique constraint covering the columns `[user_id,post_id]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `ProductLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PostLike_post_id_key";

-- DropIndex
DROP INDEX "PostLike_user_id_key";

-- DropIndex
DROP INDEX "ProductLike_product_id_key";

-- DropIndex
DROP INDEX "ProductLike_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_user_id_post_id_key" ON "PostLike"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductLike_user_id_product_id_key" ON "ProductLike"("user_id", "product_id");
