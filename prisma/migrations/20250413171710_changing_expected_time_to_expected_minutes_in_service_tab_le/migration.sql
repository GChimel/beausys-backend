/*
  Warnings:

  - You are about to drop the column `expected_time` on the `services` table. All the data in the column will be lost.
  - Added the required column `expected_minutes` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "expected_time",
ADD COLUMN     "expected_minutes" TEXT NOT NULL;
