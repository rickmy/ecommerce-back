/*
  Warnings:

  - You are about to drop the column `idUser` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userDNI]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userDNI` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_idUser_fkey";

-- DropIndex
DROP INDEX "Student_idUser_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "idUser",
ADD COLUMN     "userDNI" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_userDNI_key" ON "Student"("userDNI");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userDNI_fkey" FOREIGN KEY ("userDNI") REFERENCES "User"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;
