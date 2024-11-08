import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ImageInfoDto } from './image-product.dto';
import { IsArray } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    type: [ImageInfoDto],
    example: [{ image: 'product-1.jpg', isMain: true }],
    description: 'Product images',
  })
  @IsArray({ message: 'Images must be an array' })
  images: ImageInfoDto[];
}
