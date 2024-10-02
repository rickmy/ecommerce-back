-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_idProject_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "idProject" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
