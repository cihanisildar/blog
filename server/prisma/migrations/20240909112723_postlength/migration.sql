-- CreateEnum
CREATE TYPE "PostLength" AS ENUM ('SHORT', 'MEDIUM', 'LONG');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "length" "PostLength" NOT NULL DEFAULT 'SHORT';
