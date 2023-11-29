/*
  Warnings:

  - The values [HAMBURGUER] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('BURGUER', 'DRINK', 'DESSERT', 'SIDEDISHE');
ALTER TABLE "products" ALTER COLUMN "productType" TYPE "ProductType_new" USING ("productType"::text::"ProductType_new");
ALTER TABLE "extras" ALTER COLUMN "productType" TYPE "ProductType_new" USING ("productType"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;
