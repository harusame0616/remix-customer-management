-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('UNKNOWN', 'MAN', 'WOMAN', 'OTHER');

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "birthday" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);
