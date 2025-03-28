/*
  Warnings:

  - You are about to drop the column `date` on the `schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[available_id]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `available_id` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "date",
ADD COLUMN     "available_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "available_schedules" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "available_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "available_schedules_id_key" ON "available_schedules"("id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_available_id_key" ON "schedules"("available_id");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_available_id_fkey" FOREIGN KEY ("available_id") REFERENCES "available_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_schedules" ADD CONSTRAINT "available_schedules_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
