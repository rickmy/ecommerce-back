import { ApiProperty } from '@nestjs/swagger';
import { StatusStudent } from '@prisma/client';

export class StudentsDto {
  @ApiProperty({ example: '1727373644', description: 'dni del estudiante' })
  dni: string;
  @ApiProperty({ example: 'Hector Gonzales', description: 'Nombres Completos' })
  completeNames: string;
  @ApiProperty({
    example: 'Desarrollo de osftware',
    description: 'Nombre de la carrera',
  })
  career: string;
  @ApiProperty({ example: 'A', description: 'Paralelo' })
  parallel: string;
  @ApiProperty({
    example: 'r@yavirac.edu.ec',
    description: 'Correo electronico',
  })
  email: string;
  @ApiProperty({ example: '2022-1P', description: 'Periodo electivo' })
  periodElective: string;
  @ApiProperty({ example: 'TERCERO', description: 'Periodo academico' })
  periodAcademic: string;
  @ApiProperty({
    example: StatusStudent.APROBADO,
    description: 'Estado del estudiante',
  })
  status: StatusStudent;
}
