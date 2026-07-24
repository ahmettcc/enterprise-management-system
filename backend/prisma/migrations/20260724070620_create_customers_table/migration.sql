-- CreateTable
CREATE TABLE "Customers" (
    "ID" SERIAL NOT NULL,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "Phone" VARCHAR(20),
    "Email" VARCHAR(100),
    "Address" VARCHAR(255),

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("ID")
);
