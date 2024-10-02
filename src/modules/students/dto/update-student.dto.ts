
import { StatusStudent } from '@prisma/client';
import { CreateStudentDto } from './create-student.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStudentDto  {

    @ApiProperty({description:'Primer nombre del estudiante', example: 'Hugo'})
    firstName: string;
    @ApiProperty({description:'Segundo nombre del estudiante', example: 'Perez'})
    secondName: string;
    @ApiProperty({description:'Primer apellido del estudiante', example: 'Rojas'})
    lastName: string;
    @ApiProperty({description:'segundo apellido del estudiante', example: 'Vallejo'})
    secondLastName: string;
    @ApiProperty({description:'Id de la carrera', example: 1})
    idCareer: number;
    @ApiProperty({description:'Periodo lectivo del estudiante', example: '2023-2P'})
    electivePeriod: string;
    @ApiProperty({description:'Periodo académico del estudiante', example: 'CUARTO'})
    academicPeriod: string;
    @ApiProperty({description:'Paralelo del estudiante', example: 'A'})
    parallel: string;
    @IsEnum(StatusStudent, { message: 'El Status del estudiante es inválido' })
    @ApiProperty({
    description: 'Tipo de DNI',
    enum: StatusStudent,
    default: StatusStudent.APROBADO,
    })
    status: StatusStudent;

}
