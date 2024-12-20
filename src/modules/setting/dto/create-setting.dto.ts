import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    example: 'home',
    description: 'nombre de la página',
  })
  @IsString({ message: 'El valor debe ser de tipo string' })
  page: string;
  @ApiProperty({
    example: 'title',
    description: 'nombre de la configuración',
  })
  @IsString({ message: 'El valor debe ser de tipo string' })
  name: string;
  @ApiProperty({
    example: 'Ecommerce',
    description: 'valor de la configuración',
  })
  @IsString({ message: 'El valor debe ser de tipo string' })
  value: string;
}
