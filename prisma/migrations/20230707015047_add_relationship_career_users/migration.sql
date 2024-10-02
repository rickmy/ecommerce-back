/*
  Warnings:

  - You are about to drop the column `coordinator` on the `Career` table. All the data in the column will be lost.
  - You are about to drop the column `respStepDual` on the `Career` table. All the data in the column will be lost.
  - You are about to drop the column `viceCoordinator` on the `Career` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idCoordinator]` on the table `Career` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idViceCoordinator]` on the table `Career` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idRespStepDual]` on the table `Career` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idCoordinator` to the `Career` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idRespStepDual` to the `Career` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idViceCoordinator` to the `Career` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Career_coordinator_key";

-- DropIndex
DROP INDEX "Career_respStepDual_key";

-- DropIndex
DROP INDEX "Career_viceCoordinator_key";

-- AlterTable
ALTER TABLE "Career" DROP COLUMN "coordinator",
DROP COLUMN "respStepDual",
DROP COLUMN "viceCoordinator",
ADD COLUMN     "idCoordinator" INTEGER NOT NULL,
ADD COLUMN     "idRespStepDual" INTEGER NOT NULL,
ADD COLUMN     "idViceCoordinator" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Career_idCoordinator_key" ON "Career"("idCoordinator");

-- CreateIndex
CREATE UNIQUE INDEX "Career_idViceCoordinator_key" ON "Career"("idViceCoordinator");

-- CreateIndex
CREATE UNIQUE INDEX "Career_idRespStepDual_key" ON "Career"("idRespStepDual");

-- AddForeignKey
ALTER TABLE "Career" ADD CONSTRAINT "Career_idCoordinator_fkey" FOREIGN KEY ("idCoordinator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career" ADD CONSTRAINT "Career_idViceCoordinator_fkey" FOREIGN KEY ("idViceCoordinator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career" ADD CONSTRAINT "Career_idRespStepDual_fkey" FOREIGN KEY ("idRespStepDual") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
