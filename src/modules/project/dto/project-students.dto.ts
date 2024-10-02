import { ApiProperty } from "@nestjs/swagger";

export class ProjectStudents {
  @ApiProperty({ example: 1, description: 'Id estudiante' })
  id: number;
  
  @ApiProperty({ example: 'Juan Alberto', description: 'Nombre del estudiante' })
  fullName: string;
  
  @ApiProperty({ example: '1726345645', description: 'Cédula del estudiante' })
  dni: string;
  
  @ApiProperty({ example: 'TERCERO', description: 'Período académico' })
  academicPeriod: string;
}
