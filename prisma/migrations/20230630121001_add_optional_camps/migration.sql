-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_idCareer_fkey";

-- DropForeignKey
ALTER TABLE "Tutor" DROP CONSTRAINT "Tutor_idCompany_fkey";

-- DropIndex
DROP INDEX "Tutor_idCompany_key";

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "idCareer" DROP NOT NULL,
ALTER COLUMN "idCompany" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_idCareer_fkey" FOREIGN KEY ("idCareer") REFERENCES "Career"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
