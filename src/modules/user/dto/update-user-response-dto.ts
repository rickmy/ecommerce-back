import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponseDto {
  @ApiProperty({ example: 'Usuario Actualizado' })
  message: string;
}