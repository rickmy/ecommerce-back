import { ApiProperty } from "@nestjs/swagger";
import { Project, StatusProject } from "@prisma/client";

export class ProjectEntity implements Project {
    @ApiProperty({ example: 1, description: 'Identificador', type: 'number' })
    id: number;
    @ApiProperty({ example: 'Cecy', description: 'Nombre del proyecto', type: 'string' })
    name: string;
    @ApiProperty({ example: 'Proyecto de asignacion de estudiantes', description: 'Descripción del proyecto', type: 'string' })
    description: string;
    createdAt: Date;
    updatedAt: Date;
    state: boolean;
    @ApiProperty({
        example: 'ACTIVO',
        description: 'Status del proyecto',
        enum: StatusProject,
        type: 'string',
      })
    status: StatusProject;
    @ApiProperty({ example: 1, description: 'Id Tutor académico', type: 'number' })
    idAcademicTutor: number;
    @ApiProperty({ example: 1, description: 'Id tutor empresarial', type: 'number' })
    idBusinessTutor: number;
    @ApiProperty({ example: 1, description: 'ID compañia', type: 'number' })
    idCompany: number;
    
}
