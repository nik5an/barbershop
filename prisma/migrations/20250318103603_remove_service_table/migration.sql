/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Appointments` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_serviceId_fkey";

-- AlterTable
ALTER TABLE "Appointments" DROP COLUMN "serviceId";

-- DropTable
DROP TABLE "Service";
