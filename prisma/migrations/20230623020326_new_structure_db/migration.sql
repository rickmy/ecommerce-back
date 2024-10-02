/*
  Warnings:

  - The values [PENDIENTE,ACTIVO,INACTIVO,PERDIDO] on the enum `StatusStudent` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `academicPeriod` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `electivePeriod` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `idProject` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `parallel` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `secondLastName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `typeDni` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `CompaniesHasStudents` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idUser]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusStudent_new" AS ENUM ('ASIGNADO', 'APROBADO', 'RETIRADO', 'REPROBADO');
ALTER TABLE "Student" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Student" ALTER COLUMN "status" TYPE "StatusStudent_new" USING ("status"::text::"StatusStudent_new");
ALTER TYPE "StatusStudent" RENAME TO "StatusStudent_old";
ALTER TYPE "StatusStudent_new" RENAME TO "StatusStudent";
DROP TYPE "StatusStudent_old";
ALTER TABLE "Student" ALTER COLUMN "status" SET DEFAULT 'APROBADO';
COMMIT;

-- DropForeignKey
ALTER TABLE "CompaniesHasStudents" DROP CONSTRAINT "CompaniesHasStudents_idCompany_fkey";

-- DropForeignKey
ALTER TABLE "CompaniesHasStudents" DROP CONSTRAINT "CompaniesHasStudents_idStudent_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_idProject_fkey";

-- DropIndex
DROP INDEX "Student_dni_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "academicPeriod",
DROP COLUMN "dni",
DROP COLUMN "electivePeriod",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "idProject",
DROP COLUMN "lastName",
DROP COLUMN "parallel",
DROP COLUMN "password",
DROP COLUMN "secondLastName",
DROP COLUMN "secondName",
DROP COLUMN "typeDni",
ADD COLUMN     "idUser" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'APROBADO';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secondLastName" TEXT,
ADD COLUMN     "secondName" TEXT,
ADD COLUMN     "userName" TEXT NOT NULL;

-- DropTable
DROP TABLE "CompaniesHasStudents";

-- CreateTable
CREATE TABLE "studentAssignedToCompany" (
    "idCompany" INTEGER NOT NULL,
    "idStudent" INTEGER NOT NULL,
    "idProject" INTEGER NOT NULL,
    "electivePeriod" TEXT NOT NULL,
    "academicPeriod" TEXT NOT NULL,
    "parallel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "studentAssignedToCompany_pkey" PRIMARY KEY ("idCompany","idStudent")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_idUser_key" ON "Student"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAssignedToCompany" ADD CONSTRAINT "studentAssignedToCompany_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAssignedToCompany" ADD CONSTRAINT "studentAssignedToCompany_idStudent_fkey" FOREIGN KEY ("idStudent") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAssignedToCompany" ADD CONSTRAINT "studentAssignedToCompany_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
