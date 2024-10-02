/*
  Warnings:

  - The primary key for the `studentAssignedToCompany` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "studentAssignedToCompany" DROP CONSTRAINT "studentAssignedToCompany_idCompany_fkey";

-- DropForeignKey
ALTER TABLE "studentAssignedToCompany" DROP CONSTRAINT "studentAssignedToCompany_idProject_fkey";

-- AlterTable
ALTER TABLE "studentAssignedToCompany" DROP CONSTRAINT "studentAssignedToCompany_pkey",
ALTER COLUMN "idCompany" DROP NOT NULL,
ALTER COLUMN "idProject" DROP NOT NULL,
ADD CONSTRAINT "studentAssignedToCompany_pkey" PRIMARY KEY ("idStudent");

-- AddForeignKey
ALTER TABLE "studentAssignedToCompany" ADD CONSTRAINT "studentAssignedToCompany_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentAssignedToCompany" ADD CONSTRAINT "studentAssignedToCompany_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
