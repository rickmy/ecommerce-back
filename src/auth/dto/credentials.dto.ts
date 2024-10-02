import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CredentialsDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser un texto' })
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'r@r.com',
  })
  email: string;
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '12345678',
  })
  password: string;
}
