/*
  Warnings:

  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "Roles" (
    "ID" SERIAL NOT NULL,
    "RoleName" VARCHAR(50) NOT NULL,
    "Description" VARCHAR(255),

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_RoleName_key" ON "Roles"("RoleName");
