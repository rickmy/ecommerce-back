-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_idAcademicTutor_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "idAcademicTutor" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_idAcademicTutor_fkey" FOREIGN KEY ("idAcademicTutor") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
