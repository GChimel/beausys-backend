/*
  Warnings:

  - Added the required column `address_number` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "address_number" INTEGER NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;
