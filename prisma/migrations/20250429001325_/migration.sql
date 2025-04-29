/*
  Warnings:

  - A unique constraint covering the columns `[abacate_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "abacate_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_abacate_id_key" ON "users"("abacate_id");
