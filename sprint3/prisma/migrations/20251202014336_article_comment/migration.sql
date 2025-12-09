-- CreateTable
CREATE TABLE "articleComment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "article_id" BIGINT NOT NULL,

    CONSTRAINT "articleComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articleComment" ADD CONSTRAINT "articleComment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
