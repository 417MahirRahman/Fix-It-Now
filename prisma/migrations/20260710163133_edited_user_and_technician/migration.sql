/*
  Warnings:

  - You are about to drop the column `comment` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `avgRating` on the `TechnicianProfile` table. All the data in the column will be lost.
  - You are about to drop the column `hourlyRate` on the `TechnicianProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `TechnicianProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `TechnicianProfile` table. All the data in the column will be lost.
  - Added the required column `availability` to the `TechnicianProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_technicianId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "comment",
ADD COLUMN     "review" VARCHAR(500);

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TechnicianProfile" DROP COLUMN "avgRating",
DROP COLUMN "hourlyRate",
DROP COLUMN "isVerified",
DROP COLUMN "skills",
ADD COLUMN     "availability" TIMESTAMP(3) NOT NULL;
