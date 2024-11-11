import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'id del usuario', example: 1 })
  id: number;
  @ApiProperty({ description: 'dni del usuario', example: '1234567890' })
  dni: string;
  @ApiProperty({ description: 'nombre del usuario', example: 'Carlos' })
  name: string;
  @ApiProperty({ description: 'apellido del usuario', example: 'Slim' })
  lastName: string;
  @ApiProperty({ description: 'nombre del usuario', example: 'Carlos Slim' })
  completeName: string;
  @ApiProperty({
    description: 'nombre de la empresa del usuario',
    example: 'Telcel',
  })
  company?: string;
  @ApiProperty({
    description: 'email del usuario',
    example: 'r@yavirac.edu.ec',
  })
  email: string;
  @ApiProperty({ description: 'estado del usuario', example: true })
  status: boolean;
  @ApiProperty({ description: 'rol del usuario', example: 'ADMIN' })
  roleId: number;
  @ApiProperty({ description: 'nombre del rol', example: 'ADMIN' })
  role: string;
}
