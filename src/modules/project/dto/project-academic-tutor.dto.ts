import { ApiProperty } from "@nestjs/swagger";

export class AcademicTutor{
    @ApiProperty({ example: '1', description: 'Id tutor academico' })
    id: number;
    @ApiProperty({ example: 'Alberto', description: 'Nombre del tutor academico' })
    firstName: string;
    @ApiProperty({ example: 'Perez', description: 'Apellido del tutor academico' })
    lastName: string;
}