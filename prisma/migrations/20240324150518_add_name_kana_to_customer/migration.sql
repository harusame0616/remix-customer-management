-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "nameKana" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Customer" RENAME COLUMN "notes" TO "note";
