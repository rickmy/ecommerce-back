import { ApiProperty } from '@nestjs/swagger';
import { StatusStudent, TypeDNI } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentsDto {
  @IsEnum(TypeDNI, { message: 'El tipo de DNI es inválido' })
  @ApiProperty({
    description: 'Tipo de DNI',
    enum: TypeDNI,
    default: TypeDNI.CEDULA,
  })
  typeDni: TypeDNI;
  @IsString({ message: 'el dni debe ser un string' })
  @IsNotEmpty({ message: 'el dni no debe estar vacio' })
  @ApiProperty({ description: 'dni estudiante', example: '1724345645' })
  dni: string;
  @IsString({ message: 'el primer nombre debe ser un string' })
  @IsNotEmpty({ message: 'el primer nombre no debe estar vacio' })
  @ApiProperty({ description: 'primer nombre estudiante', example: 'Hugo' })
  firstName: string;
  @IsString({ message: 'el segundo nombre debe ser un string' })
  @IsNotEmpty({ message: 'el segundo nombre no debe estar vacio' })
  @ApiProperty({ description: 'segundo nombre estudiante', example: 'Alberto' })
  secondName: string;
  @IsString({ message: 'el primer apellido debe ser un string' })
  @IsNotEmpty({ message: 'el primer apellido no debe estar vacio' })
  @ApiProperty({ description: 'primer apellido estudiante', example: 'Ruiz' })
  lastName: string;
  @IsString({ message: 'el segundo apellido debe ser un string' })
  @IsNotEmpty({ message: 'el segundo apellido no debe estar vacio' })
  @ApiProperty({
    description: 'segundo apellido estudiante',
    example: 'Sánchez',
  })
  secondLastName: string;
  @IsString({ message: 'el correo electrónico debe ser un string' })
  @IsNotEmpty({ message: 'el correo electrónico no debe estar vacio' })
  @ApiProperty({
    description: 'correo electrónico estudiante',
    example: 'has.ruiz@yavirac.edu.ec',
  })
  email: string;
  @IsEnum(StatusStudent, { message: 'El estado del estudiante es inválido' })
  @ApiProperty({
    description: 'Estado del estudiante',
    enum: StatusStudent,
    default: StatusStudent.APROBADO,
  })
  status: StatusStudent;
  @IsNumber({}, { message: 'el id del suaurio  debe ser un número' })
  @ApiProperty({ description: 'ID usuario', example: 1 })
  idUser: number;
  @IsNumber({}, { message: 'La carrera debe ser un número' })
  @ApiProperty({ description: 'ID carrera', example: 1 })
  idCareer: number;
}

