/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StudentAssignedToCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dni` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secondLastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `typeDni` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AcademicTutor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessTutor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dni]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `idUser` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `dni` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `idUser` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AcademicTutor" DROP CONSTRAINT "AcademicTutor_idCareer_fkey";

-- DropForeignKey
ALTER TABLE "AcademicTutor" DROP CONSTRAINT "AcademicTutor_idUser_fkey";

-- DropForeignKey
ALTER TABLE "BusinessTutor" DROP CONSTRAINT "BusinessTutor_idCompany_fkey";

-- DropForeignKey
ALTER TABLE "BusinessTutor" DROP CONSTRAINT "BusinessTutor_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_idUser_fkey";

-- DropIndex
DROP INDEX "User_dni_key";

-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "idUser",
ADD COLUMN     "idUser" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ADD COLUMN     "dni" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "secondLastName" TEXT,
ADD COLUMN     "secondName" TEXT,
ADD COLUMN     "typeDni" "TypeDNI" NOT NULL DEFAULT 'CEDULA',
ADD COLUMN     "userName" TEXT NOT NULL,
DROP COLUMN "idUser",
ADD COLUMN     "idUser" INTEGER NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StudentAssignedToCompany" DROP CONSTRAINT "StudentAssignedToCompany_pkey",
ADD CONSTRAINT "StudentAssignedToCompany_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "dni",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "secondLastName",
DROP COLUMN "secondName",
DROP COLUMN "typeDni",
DROP COLUMN "userName",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "AcademicTutor";

-- DropTable
DROP TABLE "BusinessTutor";

-- CreateTable
CREATE TABLE "Tutor" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAcademic" BOOLEAN NOT NULL DEFAULT true,
    "idUser" INTEGER NOT NULL,
    "idCareer" INTEGER NOT NULL,
    "idCompany" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_dni_key" ON "Tutor"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_email_key" ON "Tutor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_idUser_key" ON "Tutor"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_idCompany_key" ON "Tutor"("idCompany");

-- CreateIndex
CREATE UNIQUE INDEX "Company_idUser_key" ON "Company"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Student_dni_key" ON "Student"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userName_key" ON "Student"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_idUser_key" ON "Student"("idUser");

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_idCareer_fkey" FOREIGN KEY ("idCareer") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_idAcademicTutor_fkey" FOREIGN KEY ("idAcademicTutor") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_idBusinessTutor_fkey" FOREIGN KEY ("idBusinessTutor") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
