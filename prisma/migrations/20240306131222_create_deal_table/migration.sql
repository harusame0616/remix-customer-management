-- CreateTable
CREATE TABLE "Deal" (
    "dealId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "urls" TEXT[],
    "deadline" TIMESTAMP(3),
    "attachments" TEXT[],
    "platformId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "customerId" UUID NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("dealId")
);

-- CreateTable
CREATE TABLE "DealPlatform" (
    "dealPlatformId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "DealPlatform_pkey" PRIMARY KEY ("dealPlatformId")
);

-- CreateTable
CREATE TABLE "DealStatus" (
    "dealStatusId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "DealStatus_pkey" PRIMARY KEY ("dealStatusId")
);

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "DealPlatform"("dealPlatformId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "DealStatus"("dealStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;
