ALTER TABLE "SaleItems" RENAME TO "SaleDetails";

ALTER TABLE "SaleDetails"
RENAME CONSTRAINT "SaleItems_pkey" TO "SaleDetails_pkey";

ALTER TABLE "SaleDetails"
RENAME CONSTRAINT "SaleItems_SaleID_fkey" TO "SaleDetails_SaleID_fkey";

ALTER TABLE "SaleDetails"
RENAME CONSTRAINT "SaleItems_ProductID_fkey" TO "SaleDetails_ProductID_fkey";

ALTER TABLE "SaleDetails"
RENAME CONSTRAINT "SaleItems_WarehouseID_fkey" TO "SaleDetails_WarehouseID_fkey";