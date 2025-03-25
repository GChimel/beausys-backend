/*
  Warnings:

  - You are about to drop the column `user_id` on the `schedules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_user_id_fkey";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "user_id",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;
