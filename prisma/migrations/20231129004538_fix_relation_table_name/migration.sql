/*
  Warnings:

  - You are about to drop the `ItensOnOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItensOnOrders" DROP CONSTRAINT "ItensOnOrders_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItensOnOrders" DROP CONSTRAINT "ItensOnOrders_orderId_fkey";

-- DropTable
DROP TABLE "ItensOnOrders";

-- CreateTable
CREATE TABLE "ItensInOrders" (
    "orderId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidPrice" INTEGER NOT NULL,

    CONSTRAINT "ItensInOrders_pkey" PRIMARY KEY ("orderId","itemId")
);

-- AddForeignKey
ALTER TABLE "ItensInOrders" ADD CONSTRAINT "ItensInOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensInOrders" ADD CONSTRAINT "ItensInOrders_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
