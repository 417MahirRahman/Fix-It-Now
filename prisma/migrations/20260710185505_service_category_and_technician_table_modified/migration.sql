/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `technicianId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `experienceYears` on the `TechnicianProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `TechnicianProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_name` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `TechnicianProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "category_name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "rating",
DROP COLUMN "technicianId",
DROP COLUMN "title",
ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "service_name" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "TechnicianProfile" DROP COLUMN "experienceYears",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_name_key" ON "Category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianProfile_serviceId_key" ON "TechnicianProfile"("serviceId");

-- AddForeignKey
ALTER TABLE "TechnicianProfile" ADD CONSTRAINT "TechnicianProfile_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
