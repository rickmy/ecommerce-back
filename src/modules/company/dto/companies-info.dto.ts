import { ApiProperty } from "@nestjs/swagger";
import { StatusCompany, StatusProject } from "@prisma/client";
import { CompaniesAgreements } from "./companiesAgreements.dto";
import { CompaniesProjects } from "./companiesProjects.dto";
import { IsEnum } from "class-validator";

export class CompaniesInfoDto {
    @ApiProperty({ example: '123412341234', description: 'Id empresa' })
    id: number;
    @ApiProperty({ example: '123412341234', description: 'Ruc empresa' })
    ruc: string;
    @ApiProperty({ example: 'Yavi EC', description: 'Nombre empresa' })
    name: string;
    @ApiProperty({ example: 'Av. 5 de Julio y moran valverde', description: 'Direccion empresa' })
    address: string;
    @IsEnum(StatusCompany, { message: 'El status de la empresa es inválido' })
    @ApiProperty({
      description: 'Status empresa',
      enum: StatusCompany,
      default: StatusCompany.ACTIVO,
    })
    status: StatusCompany;

    @ApiProperty({ example: '1726345645', description: 'Dni representante legal' })
    dniRepresentLegal: string;
    @ApiProperty({ example: 'Juan Rios', description: 'Nombre representante legal' })
    nameRepresentLegal: string;
    @ApiProperty({ example: 'yav.ec@yavirac.edu.ec', description: 'Email' })
    email: string;
    @ApiProperty({ example: '091548957', description: 'Número representante legal' })
    phone: string;
    @ApiProperty({ type: [CompaniesAgreements], description: 'Convenios de la empresa' })
    agreements: CompaniesAgreements[];
    @ApiProperty({ type: [CompaniesProjects], description: 'Proyectos de la empresa' })
    projects: CompaniesProjects[];

}