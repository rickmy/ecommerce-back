-- CreateEnum
CREATE TYPE "StatusCompany" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'RETIRADA', 'ACTIVO');

-- CreateEnum
CREATE TYPE "StatusStudent" AS ENUM ('ASIGNADO', 'RETIRADO', 'PENDIENTE', 'ACTIVO', 'INACTIVO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "StatusProject" AS ENUM ('PENDIENTE', 'ACTIVO', 'INACTIVO');

-- CreateTable
CREATE TABLE "AcademicTutor" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idCareer" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AcademicTutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessTutor" (
    "id" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idCompany" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BusinessTutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dniRepresentLegal" TEXT NOT NULL,
    "nameRepresentLegal" TEXT NOT NULL,
    "lastNameRepresentLegal" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "status" "StatusCompany" NOT NULL DEFAULT 'PENDIENTE',
    "idCareer" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "timeRenovationAgreement" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "coordinator" TEXT NOT NULL,
    "viceCoordinator" TEXT NOT NULL,
    "respStepDual" TEXT NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "typeDni" "TypeDNI" NOT NULL DEFAULT 'CEDULA',
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "secondLastName" TEXT NOT NULL,
    "electivePeriod" TEXT NOT NULL,
    "academicPeriod" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "status" "StatusStudent" NOT NULL DEFAULT 'PENDIENTE',
    "idCareer" INTEGER NOT NULL,
    "idProject" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "status" "StatusProject" NOT NULL DEFAULT 'PENDIENTE',
    "idAcademicTutor" INTEGER NOT NULL,
    "idBusinessTutor" INTEGER NOT NULL,
    "idCompany" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompaniesHasStudents" (
    "idCompany" INTEGER NOT NULL,
    "idStudent" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CompaniesHasStudents_pkey" PRIMARY KEY ("idCompany","idStudent")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "documents" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "status" "StatusProject" NOT NULL DEFAULT 'PENDIENTE',
    "idCompany" INTEGER NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicTutor_idUser_key" ON "AcademicTutor"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessTutor_idUser_key" ON "BusinessTutor"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Company_ruc_key" ON "Company"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_dniRepresentLegal_key" ON "Company"("dniRepresentLegal");

-- CreateIndex
CREATE UNIQUE INDEX "Career_code_key" ON "Career"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Career_coordinator_key" ON "Career"("coordinator");

-- CreateIndex
CREATE UNIQUE INDEX "Career_viceCoordinator_key" ON "Career"("viceCoordinator");

-- CreateIndex
CREATE UNIQUE INDEX "Career_respStepDual_key" ON "Career"("respStepDual");

-- CreateIndex
CREATE UNIQUE INDEX "Student_dni_key" ON "Student"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_code_key" ON "Agreement"("code");

-- AddForeignKey
ALTER TABLE "AcademicTutor" ADD CONSTRAINT "AcademicTutor_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicTutor" ADD CONSTRAINT "AcademicTutor_idCareer_fkey" FOREIGN KEY ("idCareer") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessTutor" ADD CONSTRAINT "BusinessTutor_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessTutor" ADD CONSTRAINT "BusinessTutor_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_idCareer_fkey" FOREIGN KEY ("idCareer") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_idCareer_fkey" FOREIGN KEY ("idCareer") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_idAcademicTutor_fkey" FOREIGN KEY ("idAcademicTutor") REFERENCES "AcademicTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_idBusinessTutor_fkey" FOREIGN KEY ("idBusinessTutor") REFERENCES "BusinessTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompaniesHasStudents" ADD CONSTRAINT "CompaniesHasStudents_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompaniesHasStudents" ADD CONSTRAINT "CompaniesHasStudents_idStudent_fkey" FOREIGN KEY ("idStudent") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_idCompany_fkey" FOREIGN KEY ("idCompany") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
