import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { CreateStudentsDto } from 'src/modules/students/dto/create-students.dto';

export class CreateUserStudentDto {
  @ApiProperty({ example: '12345678', description: 'DNI', type: 'string' })
  @IsString({ message: 'el campo debe ser un string' })
  dni: string;
  @ApiProperty({
    example: 'hector.ruiz',
    description: 'Nombre de usuario',
    type: 'string',
  })
  @IsString({ message: 'el campo debe ser un string' })
  userName: string;
  @ApiProperty({ example: 'Juan', description: 'Nombre', type: 'string' })
  @IsString({ message: 'el campo debe ser un string' })
  firstName: string;
  @ApiProperty({
    example: 'Pablo',
    description: 'Segundo Nombre',
    type: 'string',
  })
  @IsString({ message: 'el campo debe ser un string' })
  secondName: string;
  @ApiProperty({ example: 'Perez', description: 'Apellido', type: 'string' })
  @IsString({ message: 'el campo debe ser un string' })
  lastName: string;
  @ApiProperty({
    example: 'Garcia',
    description: 'Segundo Apellido',
    type: 'string',
  })
  @IsString({ message: 'el campo debe ser un string' })
  secondLastName: string;
  @ApiProperty({
    example: 'example@yavirac.edu.ec',
    description: 'Correo',
    type: 'string',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '12345678',
    description: 'Contraseña',
    type: 'string',
  })
  @IsString({ message: 'el campo debe ser un string' })
  password: string;
  @ApiProperty({ example: '1', description: 'Rol', type: 'number' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'El rol debe ser un número' },
  )
  idRol: number;
  Student: CreateStudentsDto;
}
