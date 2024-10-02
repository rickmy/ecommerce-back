/*
  Warnings:

  - You are about to drop the `studentAssignedToCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "studentAssignedToCompany" DROP CONSTRAINT "studentAssignedToCompany_idCompany_fkey";

-- DropForeignKey
ALTER TABLE "studentAssignedToCompany" DROP CONSTRAINT "studentAssignedToCompany_idProject_fkey";

-- DropForeignKey
ALTER TABLE "studentAssignedToCompany" DROP CONSTRAINT "studentAssignedToCompany_idStudent_fkey";

-- DropTable
DROP TABLE "studentAssignedToCompany";

-- CreateTable
CREATE TABLE "StudentAssignedToCompany" (
    "idCompany" INTEGER,
    "idStudent" INTEGER NOT NULL,
    "idProject" INTEGER,
    "electivePeriod" TEXT NOT NULL,
    "academicPeriod" TEXT NOT NULL,
    "parallel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudentAssignedToCompany_pkey" PRIMARY KEY ("idStudent")
);

-- AddForeignKey
ALTER TABLE "StudentAssignedToCompany" ADD CONSTRAINT "StudentAssignedToCompany_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignedToCompany" ADD CONSTRAINT "StudentAssignedToCompany_idStudent_fkey" FOREIGN KEY ("idStudent") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAssignedToCompany" ADD CONSTRAINT "StudentAssignedToCompany_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
