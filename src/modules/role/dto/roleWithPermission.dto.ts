import { PermissionEntity } from 'src/modules/permissions/entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RoleWithPermission {
  @ApiProperty({ type: RoleEntity, description: 'Role' })
  role: RoleEntity;

  @ApiProperty({
    type: [PermissionEntity],
    isArray: true,
    description: 'Permissions',
  })
  permissions: PermissionEntity[];
}
