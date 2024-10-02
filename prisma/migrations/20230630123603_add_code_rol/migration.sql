/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Rol" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Rol_code_key" ON "Rol"("code");
