/*
  Warnings:

  - A unique constraint covering the columns `[ProductID,WarehouseID]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `WarehouseID` to the `SaleItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleItems" ADD COLUMN     "WarehouseID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_ProductID_WarehouseID_key" ON "Stock"("ProductID", "WarehouseID");

-- AddForeignKey
ALTER TABLE "SaleItems" ADD CONSTRAINT "SaleItems_WarehouseID_fkey" FOREIGN KEY ("WarehouseID") REFERENCES "Warehouses"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
