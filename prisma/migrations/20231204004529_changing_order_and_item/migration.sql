/*
  Warnings:

  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itens" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" "PaidWith" NOT NULL;
