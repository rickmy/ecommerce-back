import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class RoleEntity implements Role {
  @ApiProperty({ example: 1, description: 'Rol id', readOnly: true })
  id: number;
  @ApiProperty({ example: '123456789', description: 'Rol name' })
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}
