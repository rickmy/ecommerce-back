import { ApiProperty } from "@nestjs/swagger";
import { StatusProject } from "@prisma/client";
import { IsEnum } from "class-validator";

export class CompaniesProjects {
    @ApiProperty({ example: 1, description: 'Identificador', type: 'number' })
    id: number;
    @ApiProperty({ example: 'Yavi Ec', description: 'Nombre proyecto' })
    name: string;
    @ApiProperty({ example: 'Este es un proyecto de asignacion de estudiantes a empresas', description: 'Descripcion del proyecto' })
    description: string;
    @IsEnum(StatusProject, { message: 'El status de la empresa es inválido' })
    @ApiProperty({
      description: 'Status empresa',
      enum: StatusProject,
      default: StatusProject.ACTIVO,
    })
    status: StatusProject;
   
}