import { ApiProperty } from "@nestjs/swagger";

export class StudentProjectDto {
  @ApiProperty({ example: 'Hector Gonzales', description: 'Nombres Completos' })
  completeNames: string;
  @ApiProperty({ example: '2022-1P', description: 'Periodo electivo' })
  periodElective: string;
  @ApiProperty({ example: 'TERCERO', description: 'Periodo academico' })
  periodAcademic: string;
  @ApiProperty({ example: 'Desarrollo de software', description: 'Nombre del Proyecto' })
  project: string;
}