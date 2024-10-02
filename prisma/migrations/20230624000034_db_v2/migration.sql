/*
  Warnings:

  - The primary key for the `AcademicTutor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BusinessTutor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userDNI` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `StudentAssignedToCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[idUser]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AcademicTutor" DROP CONSTRAINT "AcademicTutor_idUser_fkey";

-- DropForeignKey
ALTER TABLE "BusinessTutor" DROP CONSTRAINT "BusinessTutor_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_idUser_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_idAcademicTutor_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_idBusinessTutor_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userDNI_fkey";

-- DropForeignKey
ALTER TABLE "StudentAssignedToCompany" DROP CONSTRAINT "StudentAssignedToCompany_idStudent_fkey";

-- DropIndex
DROP INDEX "Student_userDNI_key";

-- AlterTable
ALTER TABLE "AcademicTutor" DROP CONSTRAINT "AcademicTutor_pkey",
ALTER COLUMN "idUser" SET DATA TYPE TEXT,
ADD CONSTRAINT "AcademicTutor_pkey" PRIMARY KEY ("idUser");

-- AlterTable
ALTER TABLE "BusinessTutor" DROP CONSTRAINT "BusinessTutor_pkey",
ALTER COLUMN "idUser" SET DATA TYPE TEXT,
ADD CONSTRAINT "BusinessTutor_pkey" PRIMARY KEY ("idUser");

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "idUser" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "userDNI",
ADD COLUMN     "idUser" TEXT NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("idUser");

-- AlterTable
ALTER TABLE "StudentAssignedToCompany" DROP CONSTRAINT "StudentAssignedToCompany_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "idStudent" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentAssignedToCompany_pkey" PRIMARY KEY ("idStudent");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Student_idUser_key" ON "Student"("idUser");

-- AddForeignKey
ALTER TABLE "AcademicTutor" ADD CONSTRAINT "AcademicTutor_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessTutor" ADD CONSTRAINT "BusinessTutor_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;
