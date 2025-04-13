/*
  Warnings:

  - Changed the type of `expected_minutes` on the `services` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "expected_minutes",
ADD COLUMN     "expected_minutes" INTEGER NOT NULL;
