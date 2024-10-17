/*
  Warnings:

  - You are about to drop the column `imageNames` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrls` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageNames",
DROP COLUMN "imageUrls",
ADD COLUMN     "contentImageUrls" TEXT[],
ADD COLUMN     "mainImageName" TEXT,
ADD COLUMN     "mainImageUrl" TEXT;
