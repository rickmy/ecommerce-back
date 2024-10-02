import { Rol } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class RoleEntity implements Rol {
  @ApiProperty({ example: 1, description: 'Rol id', readOnly: true })
  id: number;
  @ApiProperty({ example: '123456789', description: 'Rol name' })
  name: string;
  @ApiProperty({ example: 'EST', description: 'Rol code' })
  code: string;
  createdAt: Date;
  updatedAt: Date;
  state: boolean;
}
