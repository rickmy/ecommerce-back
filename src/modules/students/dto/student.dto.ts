import { ApiProperty } from "@nestjs/swagger";

export class StudentDto {
  @ApiProperty({ example: 1, description: 'id del estudiante' })
  id: number;
  @ApiProperty({ example: '1727373644', description: 'dni del estudiante' })
  dni: string;
  @ApiProperty({ description: 'primer nombre estudiante', example: 'Hugo' })
  firstName: string;
  @ApiProperty({ description: 'segundo nombre estudiante', example: 'Alberto' })
  secondName: string;
  @ApiProperty({ description: 'primer apellido estudiante', example: 'Ruiz' })
  lastName: string;
  @ApiProperty({
    description: 'segundo apellido estudiante',
    example: 'Sánchez',
  })
  secondLastName: string;
  @ApiProperty({ example: 1, description: 'id de la carrera' })
  idCareer: number;
  @ApiProperty({ example: 'Desarrollo de software', description: 'Nombre de la carrera' })
  career: string;
  @ApiProperty({ example: 'A', description: 'Paralelo' })
  parallel: string;
  @ApiProperty({ example: 'r@yavirac.edu.ec', description: 'Correo electronico' })
  email: string;
  @ApiProperty({ example: '2022-1P', description: 'Periodo electivo' })
  electivePeriod: string;
  @ApiProperty({ example: 'TERCERO', description: 'Periodo academico' })
  academicPeriod: string;
  @ApiProperty({ example: 'APROBADO', description: 'Estado del estudiante' })
  status: string;
  @ApiProperty({ example: 1, description: 'id de la empresa' })
  idCompany: number;
  @ApiProperty({ example: 'Yavirac', description: 'Empresa' })
  company: string;
  @ApiProperty({ example: 'Desarrollo de software', description: 'Proyecto' })
  project: string;
  @ApiProperty({ example: 'Hector Gonzales', description: 'Tutor academico' })
  academicTutor: string;
  @ApiProperty({ example: 'Hector Gonzales', description: 'Tutor empresarial' })
  businessTutor: string;
}