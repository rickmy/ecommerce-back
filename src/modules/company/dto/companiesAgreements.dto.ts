import { ApiProperty } from "@nestjs/swagger";
import { StatusProject } from "@prisma/client";
import { IsEnum } from "class-validator";

export class CompaniesAgreements {
    @ApiProperty({ example: 1, description: 'Identificador', type: 'number' })
    id: number;
    @ApiProperty({ example: 'FHGVF45D', description: 'Código convenio' })
    code: string;
    @ApiProperty({ example: '2023/07/20', description: 'Fecha inicio convenio' })
    dateStart: Date;
    @ApiProperty({ example: '2023/07/20', description: 'Fecha final convenio' })
    dateEnd: Date;
    @IsEnum(StatusProject, { message: 'El status del convenio es inválido' })
    @ApiProperty({
      description: 'Status convenio',
      enum: StatusProject,
      default: StatusProject.ACTIVO,
    })
    status: StatusProject;
}