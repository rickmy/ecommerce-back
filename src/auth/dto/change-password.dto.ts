import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail({}, { message: 'El campo debe ser numérico' })
  @ApiProperty({ description: 'Email del usuario', example: 'r@yavirac.edu.ec'})
  @IsEmail({}, { message: 'El campo debe ser numérico' })
  email: string;
  @IsString({ message: 'El campo debe ser string' })
  @ApiProperty({
    description: 'actual contraseña del usuario',
    example: '12345678',
  })
  currentPassword: string;
  @IsString({ message: 'El campo debe ser string' })
  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: '12345678',
  })
  newPassword: string;
}
