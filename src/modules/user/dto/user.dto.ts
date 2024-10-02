import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ description: 'id del usuario', example: 1 })
  id: number;
  @ApiProperty({ description: 'dni del usuario', example: '1234567890' })
  dni: string;
  @ApiProperty({ description: 'nombre del usuario', example: 'ppepep' })
  userName: string;
  @ApiProperty({ description: 'email del usuario', example: 'r@yavirac.edu.ec' })
  email: string;
  @ApiProperty({ description: 'estado del usuario', example: true })
  state: boolean;
  @ApiProperty({ description: 'nombre del rol', example: 'ADMIN' })
  role: string;
}