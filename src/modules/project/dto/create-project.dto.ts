import { ApiProperty } from "@nestjs/swagger";
import { StatusProject,  } from "@prisma/client";
import { IsEnum } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({ example: 'YEC Project', description: 'Nombre del proyecto' })
    name: string;
    @ApiProperty({ example: 'El siguiente proyecto se va a basar en...', description: 'Descripción del proyecto' })
    description: string;
    @IsEnum(StatusProject, { message: 'El status del proyecto es inválido' })
    @ApiProperty({
      description: 'Status proyecto',
      enum: StatusProject,
      default: StatusProject.ACTIVO,
    })
    status: StatusProject;
    @ApiProperty({ example: '1', description: 'ID Tutor empresarial' })
    idBusinessTutor: number;
    @ApiProperty({ example: '1', description: 'ID empresa' })
    idCompany: number;
}
