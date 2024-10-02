-- CreateEnum
CREATE TYPE "TypeDNI" AS ENUM ('CEDULA', 'RUC', 'PASAPORTE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "typeDni" "TypeDNI" NOT NULL DEFAULT 'CEDULA',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "idRol" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolHasPermission" (
    "idRol" INTEGER NOT NULL,
    "idPermission" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RolHasPermission_pkey" PRIMARY KEY ("idRol","idPermission")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_name_key" ON "Rol"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolHasPermission" ADD CONSTRAINT "RolHasPermission_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolHasPermission" ADD CONSTRAINT "RolHasPermission_idPermission_fkey" FOREIGN KEY ("idPermission") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
