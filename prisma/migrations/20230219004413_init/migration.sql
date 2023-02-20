/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refDoctor` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('NURSE', 'DOCTOR');

-- CreateEnum
CREATE TYPE "LiquidState" AS ENUM ('INTACT', 'CLAIR', 'MECONIAL', 'BLOOD');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "bio",
DROP COLUMN "userId",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "refDoctor" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'NURSE',
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Partogramme" (
    "id" UUID NOT NULL,
    "noFile" BIGINT NOT NULL,
    "admissionDateTime" TIME NOT NULL,
    "workStartDateTime" TIME NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "commentary" TEXT NOT NULL,
    "state" BYTEA NOT NULL,
    "nurseId" UUID NOT NULL,

    CONSTRAINT "Partogramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyHeartFrequency" (
    "id" UUID NOT NULL,
    "babyFc" DOUBLE PRECISION NOT NULL,
    "Rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "BabyHeartFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amnioticLiquid" (
    "id" UUID NOT NULL,
    "stateLiquid" "LiquidState" NOT NULL DEFAULT 'INTACT',
    "Rank" DECIMAL NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "amnioticLiquid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dilation" (
    "id" UUID NOT NULL,
    "dilation" DOUBLE PRECISION NOT NULL,
    "Rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "Dilation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyDescent" (
    "id" UUID NOT NULL,
    "babydescent" DOUBLE PRECISION NOT NULL,
    "Rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "BabyDescent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherHeartFrequency" (
    "id" UUID NOT NULL,
    "motherFc" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "MotherHeartFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherBloodPressure" (
    "id" UUID NOT NULL,
    "motherBloodPressure" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "MotherBloodPressure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherTemperature" (
    "id" UUID NOT NULL,
    "motherTemperature" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "MotherTemperature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotherContractionsFrequency" (
    "id" UUID NOT NULL,
    "motherContractionsFrequency" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "partogrammeId" UUID NOT NULL,

    CONSTRAINT "MotherContractionsFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partogramme_nurseId_key" ON "Partogramme"("nurseId");

-- CreateIndex
CREATE UNIQUE INDEX "BabyHeartFrequency_partogrammeId_key" ON "BabyHeartFrequency"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "amnioticLiquid_partogrammeId_key" ON "amnioticLiquid"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "Dilation_partogrammeId_key" ON "Dilation"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "BabyDescent_partogrammeId_key" ON "BabyDescent"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "MotherHeartFrequency_partogrammeId_key" ON "MotherHeartFrequency"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "MotherBloodPressure_partogrammeId_key" ON "MotherBloodPressure"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "MotherTemperature_partogrammeId_key" ON "MotherTemperature"("partogrammeId");

-- CreateIndex
CREATE UNIQUE INDEX "MotherContractionsFrequency_partogrammeId_key" ON "MotherContractionsFrequency"("partogrammeId");

-- AddForeignKey
ALTER TABLE "Partogramme" ADD CONSTRAINT "Partogramme_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyHeartFrequency" ADD CONSTRAINT "BabyHeartFrequency_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amnioticLiquid" ADD CONSTRAINT "amnioticLiquid_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dilation" ADD CONSTRAINT "Dilation_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyDescent" ADD CONSTRAINT "BabyDescent_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotherHeartFrequency" ADD CONSTRAINT "MotherHeartFrequency_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotherBloodPressure" ADD CONSTRAINT "MotherBloodPressure_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotherTemperature" ADD CONSTRAINT "MotherTemperature_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotherContractionsFrequency" ADD CONSTRAINT "MotherContractionsFrequency_partogrammeId_fkey" FOREIGN KEY ("partogrammeId") REFERENCES "Partogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
