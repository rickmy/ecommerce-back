import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class ClientDto extends UserDto {
  @ApiProperty({
    description: 'nombre de la empresa del usuario',
    example: 'Telcel',
  })
  company?: string;
  @ApiProperty({
    example: '123456789',
    description: 'Teléfono',
    type: 'string',
  })
  phone: string;
}
