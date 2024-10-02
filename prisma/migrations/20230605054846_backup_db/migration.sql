/*
  Warnings:

  - You are about to drop the column `created_at` on the `AcademicTutor` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `AcademicTutor` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `BusinessTutor` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `BusinessTutor` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Career` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Career` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `CompaniesHasStudents` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `CompaniesHasStudents` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Rol` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Rol` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `RolHasPermission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `RolHasPermission` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `AcademicTutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BusinessTutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Career` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CompaniesHasStudents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Rol` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RolHasPermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicTutor" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BusinessTutor" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Career" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CompaniesHasStudents" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rol" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RolHasPermission" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
