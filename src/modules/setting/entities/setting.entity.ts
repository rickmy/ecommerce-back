import { ApiProperty } from '@nestjs/swagger';
import { Setting } from '@prisma/client';

export class SettingEntity implements Setting {
  @ApiProperty({ example: 1, description: 'Identificador de la configuración' })
  id: number;
  @ApiProperty({
    example: 'home',
    description: 'nombre de la página',
  })
  page: string;
  @ApiProperty({
    example: 'title',
    description: 'nombre de la configuración',
  })
  name: string;
  @ApiProperty({
    example: 'Ecommerce',
    description: 'valor de la configuración',
  })
  value: string;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Fecha de actualización',
  })
  updatedAt: Date;
  @ApiProperty({
    example: true,
    description: 'Estado de la configuración',
  })
  status: boolean;
}
