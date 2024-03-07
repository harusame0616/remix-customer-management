/*
  Warnings:

  - You are about to drop the column `urls` on the `Deal` table. All the data in the column will be lost.
  - Added the required column `url` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "urls",
ADD COLUMN     "url" TEXT NOT NULL;
