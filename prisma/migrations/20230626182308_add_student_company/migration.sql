/*
  Warnings:

  - Changed the type of `idStudent` on the `StudentAssignedToCompany` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StudentAssignedToCompany" DROP COLUMN "idStudent",
ADD COLUMN     "idStudent" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentAssignedToCompany" ADD CONSTRAINT "StudentAssignedToCompany_idStudent_fkey" FOREIGN KEY ("idStudent") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
