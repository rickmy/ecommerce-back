import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'El campo debe ser contraseña' })
  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: '12345678',
  })
  newPassword: string;
  @IsString({ message: 'El campo debe ser contraseña' })
  @ApiProperty({
    description: 'Token de restablecimiento de contraseña',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  token: string;
}
