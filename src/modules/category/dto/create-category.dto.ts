import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'Categoría 1',
    description: 'Nombre de la categoría',
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(50, { message: 'El nombre no debe tener más de 50 caracteres' })
  name: string;
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Estado de la categoría',
  })
  @IsBoolean({ message: 'El estado debe ser un booleano' })
  status: boolean;
}
