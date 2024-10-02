/*
  Warnings:

  - You are about to drop the column `userId` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUser]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idUser` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "userId",
ADD COLUMN     "idUser" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_idUser_key" ON "Company"("idUser");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
