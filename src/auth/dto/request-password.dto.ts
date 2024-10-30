import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
