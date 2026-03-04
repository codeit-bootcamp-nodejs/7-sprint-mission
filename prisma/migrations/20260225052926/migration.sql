-- CreateEnum
CREATE TYPE "Type" AS ENUM ('ARTICLE_COMMENT', 'PRODUCT_COMMENT', 'PRICE_DROP');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('ARTICLE', 'PRODUCT', 'COMMENT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "type" "Type" NOT NULL,
    "targetId" BIGINT,
    "targetType" "TargetType",
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
