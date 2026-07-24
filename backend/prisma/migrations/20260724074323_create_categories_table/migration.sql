-- CreateTable
CREATE TABLE "Categories" (
    "ID" SERIAL NOT NULL,
    "CategoryName" VARCHAR(100) NOT NULL,
    "Description" VARCHAR(255),

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_CategoryName_key" ON "Categories"("CategoryName");
