/*
  Warnings:

  - You are about to drop the column `documents` on the `Agreement` table. All the data in the column will be lost.
  - Added the required column `agreementPath` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itvPath` to the `Agreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "documents",
ADD COLUMN     "agreementPath" TEXT NOT NULL,
ADD COLUMN     "itvPath" TEXT NOT NULL;
