-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'UPI', 'OTHER');

-- CreateEnum
CREATE TYPE "QuantityType" AS ENUM ('HALF', 'FULL', 'NA');

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "halfPrice" DECIMAL(10,2) NOT NULL,
    "fullPrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" SERIAL NOT NULL,
    "cgst" DECIMAL(5,2) NOT NULL,
    "sgst" DECIMAL(5,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "billNumber" BIGINT NOT NULL,
    "billDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMode" "PaymentMode" NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discountPercent" DECIMAL(5,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,
    "taxAmount" DECIMAL(10,2) NOT NULL,
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "createdBySub" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxRateId" INTEGER NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillLineItem" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantityType" "QuantityType" NOT NULL,
    "foodNameSnapshot" TEXT NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "billId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "BillLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_name_key" ON "MenuItem"("name");

-- CreateIndex
CREATE INDEX "MenuItem_isActive_idx" ON "MenuItem"("isActive");

-- CreateIndex
CREATE INDEX "TaxRate_effectiveFrom_idx" ON "TaxRate"("effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_billNumber_key" ON "Bill"("billNumber");

-- CreateIndex
CREATE INDEX "Bill_billDate_idx" ON "Bill"("billDate");

-- CreateIndex
CREATE INDEX "BillLineItem_billId_idx" ON "BillLineItem"("billId");

-- CreateIndex
CREATE INDEX "BillLineItem_menuItemId_idx" ON "BillLineItem"("menuItemId");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_taxRateId_fkey" FOREIGN KEY ("taxRateId") REFERENCES "TaxRate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillLineItem" ADD CONSTRAINT "BillLineItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillLineItem" ADD CONSTRAINT "BillLineItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
