-- CreateTable
CREATE TABLE "Suppliers" (
    "ID" SERIAL NOT NULL,
    "CompanyName" VARCHAR(100) NOT NULL,
    "ContactPerson" VARCHAR(100),
    "Phone" VARCHAR(20),
    "Email" VARCHAR(100),
    "Address" VARCHAR(255),

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Warehouses" (
    "ID" SERIAL NOT NULL,
    "WarehouseName" VARCHAR(100) NOT NULL,
    "Address" VARCHAR(255),
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warehouses_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Users" (
    "ID" SERIAL NOT NULL,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "RoleID" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Products" (
    "ID" SERIAL NOT NULL,
    "Barcode" VARCHAR(100) NOT NULL,
    "ProductName" VARCHAR(100) NOT NULL,
    "Description" VARCHAR(255),
    "PurchasePrice" DECIMAL(10,2) NOT NULL,
    "SalePrice" DECIMAL(10,2) NOT NULL,
    "CategoryID" INTEGER NOT NULL,
    "SupplierID" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Stock" (
    "ID" SERIAL NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "MinimumQuantity" INTEGER NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "WarehouseID" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Sales" (
    "ID" SERIAL NOT NULL,
    "SaleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TotalAmount" DECIMAL(10,2) NOT NULL,
    "PaymentMethod" VARCHAR(50) NOT NULL,
    "CustomerID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "SaleItems" (
    "ID" SERIAL NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "UnitPrice" DECIMAL(10,2) NOT NULL,
    "TotalPrice" DECIMAL(10,2) NOT NULL,
    "SaleID" INTEGER NOT NULL,
    "ProductID" INTEGER NOT NULL,

    CONSTRAINT "SaleItems_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "ID" SERIAL NOT NULL,
    "Action" VARCHAR(50) NOT NULL,
    "TableName" VARCHAR(100) NOT NULL,
    "RecordID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Products_Barcode_key" ON "Products"("Barcode");
