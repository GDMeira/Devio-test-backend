/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('HAMBURGUER', 'DRINK', 'DESSERT', 'SIDEDISHE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CANCELED', 'PROCESSING', 'READY');

-- CreateEnum
CREATE TYPE "PaidWith" AS ENUM ('CREDITCARD', 'DEBITCARD', 'CASH');

-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "productType" "ProductType" NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "isAvaiable" BOOLEAN NOT NULL DEFAULT true,
    "selledTimes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extras" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "productType" "ProductType" NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "isAvaiable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientName" VARCHAR(50) NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "note" VARCHAR(255),
    "productId" INTEGER NOT NULL,

    CONSTRAINT "itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItensOnOrders" (
    "orderId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidPrice" INTEGER NOT NULL,

    CONSTRAINT "ItensOnOrders_pkey" PRIMARY KEY ("orderId","itemId")
);

-- CreateTable
CREATE TABLE "_ExtraToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ExtraToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraToProduct_AB_unique" ON "_ExtraToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraToProduct_B_index" ON "_ExtraToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraToItem_AB_unique" ON "_ExtraToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraToItem_B_index" ON "_ExtraToItem"("B");

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensOnOrders" ADD CONSTRAINT "ItensOnOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensOnOrders" ADD CONSTRAINT "ItensOnOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToProduct" ADD CONSTRAINT "_ExtraToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToProduct" ADD CONSTRAINT "_ExtraToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToItem" ADD CONSTRAINT "_ExtraToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraToItem" ADD CONSTRAINT "_ExtraToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
