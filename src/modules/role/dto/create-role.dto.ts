import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { PermissionEntity } from 'src/modules/permissions/entities/permission.entity';

export class CreateRoleDto {
  @ApiProperty({ description: 'codigo del rol', example: 'admin' })
  @IsNotEmpty({ message: 'el codigo no debe estar vacio' })
  @IsString({ message: 'el codigo debe ser un string' })
  code: string;
  @IsString({ message: 'el rol debe ser un string' })
  @IsNotEmpty({ message: 'el rol no debe estar vacio' })
  @ApiProperty({ description: 'nombre del rol', example: 'admin' })
  name: string;
  @ApiProperty({
    description: 'permisos del rol',
    example: [{ id: 1, name: 'create' }],
    isArray: true,
  })
  permissions: PermissionEntity[];
}
