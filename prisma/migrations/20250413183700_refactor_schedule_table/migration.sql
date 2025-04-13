/*
  Warnings:

  - You are about to drop the column `done` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `situation` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Situation" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'DONE');

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "done",
ADD COLUMN     "situation" "Situation" NOT NULL;
