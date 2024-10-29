import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '12345678', description: 'DNI', type: 'string' })
  @IsString({ message: 'el campo debe ser un string' })
  dni: string;
  @ApiProperty({
    example: 'hector.ruiz',
    description: 'Nombre de usuario',
    type: 'string',
  })
  @IsString({ message: 'el nombre de usuario debe ser un string' })
  name: string;
  @ApiProperty({
    example: 'Ruiz',
    description: 'Apellido',
    type: 'string',
  })
  @IsString({ message: 'el apellido debe ser un string' })
  lastName: string;
  @ApiProperty({
    example: 'example@example.com',
    description: 'Correo',
    type: 'string',
  })
  @IsEmail(
    { allow_ip_domain: false },
    { message: 'el correo debe ser un email' },
  )
  email: string;
  @ApiProperty({
    example: '123456789',
    description: 'Teléfono',
    type: 'string',
  })
  @IsString({ message: 'el teléfono debe ser un string' })
  phone: string;
  @ApiProperty({
    example: 'company',
    description: 'Nombre de la empresa',
    type: 'string',
  })
  @IsOptional()
  @IsString({ message: 'el nombre de la empresa debe ser un string' })
  company?: string;
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
  roleId: number;
}
