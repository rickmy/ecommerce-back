import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class CategoryEntity implements Category {
  @ApiProperty({ example: 1, description: 'Identificador de la categoría' })
  id: number;
  @ApiProperty({
    example: 'Categoría 1',
    description: 'Nombre de la categoría',
  })
  name: string;
  @ApiProperty({
    example: 'Descripción de la categoría',
    description: 'Descripción de la categoría',
  })
  @ApiProperty({
    example: 'https://www.google.com',
    description: 'Imagen de la categoría',
  })
  image: string;
  status: boolean;
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
}
