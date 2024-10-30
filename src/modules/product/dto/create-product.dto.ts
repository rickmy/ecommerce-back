import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ImageInfoDto } from './image-product.dto';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    example: 'product-1',
    description: 'Product code',
  })
  @IsString()
  code: string;
  @ApiProperty({
    type: String,
    example: 'Product 1',
    description: 'Product name',
  })
  @IsString()
  name: string;
  @ApiProperty({
    type: String,
    example: 'Product 1 description',
    description: 'Product description',
  })
  @IsString()
  description: string;
  @ApiProperty({
    type: [ImageInfoDto],
    example: [{ image: 'product-1.jpg', isMain: true }],
    description: 'Product images',
  })
  @IsArray()
  images: ImageInfoDto[];
  @ApiProperty({
    type: [String],
    example: ['product', 'product-1'],
    description: 'Product tags',
  })
  @IsArray()
  tags: string[];
  @ApiProperty({ type: Number, example: 10, description: 'Product stock' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(0)
  stock: number;
  @ApiProperty({ type: Number, example: 100, description: 'Product price' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
  @ApiProperty({ type: Number, example: 90, description: 'Product sale price' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  priceSale: number;
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Product is on sale',
  })
  @IsBoolean()
  isSale: boolean;
  @ApiProperty({ type: Number, example: 1, description: 'Category id' })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  categoryId: number;
  @ApiProperty({ type: Boolean, example: true, description: 'Product status' })
  @IsBoolean()
  status: boolean;
}
