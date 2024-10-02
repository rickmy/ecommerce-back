import { ApiProperty } from '@nestjs/swagger';

export class UserByCareerDto {
  @ApiProperty({ type: Number, description: 'Id del usuario' })
  id: number;
  @ApiProperty({ type: String, description: 'Correo del usuario' })
  email: string;
  @ApiProperty({ type: String, description: 'Nombre completo del usuario' })
  nameComplete: string;
}
