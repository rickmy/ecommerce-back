import { RolHasPermission } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class RoleHasPermissionEntity implements RolHasPermission {
  @ApiProperty({ example: '1', description: 'Rol ID' })
  idRol: number;
  @ApiProperty({ example: '1', description: 'Permiso ID' })
  idPermission: number;
  @ApiProperty({ example: '1', description: 'Role has permission ID' })
  id: number;
  createdAt: Date;
  updatedAt: Date;
  state: boolean;
}
