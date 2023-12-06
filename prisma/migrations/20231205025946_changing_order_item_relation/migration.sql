/*
  Warnings:

  - You are about to drop the `ItensInOrders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `itens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidPrice` to the `itens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItensInOrders" DROP CONSTRAINT "ItensInOrders_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItensInOrders" DROP CONSTRAINT "ItensInOrders_orderId_fkey";

-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD COLUMN     "paidPrice" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ItensInOrders";

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
