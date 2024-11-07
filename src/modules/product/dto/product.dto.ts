import { ApiProperty } from '@nestjs/swagger';
import { ImageInfoDto } from './image-product.dto';

export class ProductDto {
  @ApiProperty({ type: Number, example: 1, description: 'Product id' })
  id: number;
  @ApiProperty({
    type: String,
    example: 'product-1',
    description: 'Product code',
  })
  code: string;
  @ApiProperty({
    type: String,
    example: 'product-1',
    description: 'Product code',
  })
  name: string;
  @ApiProperty({
    type: String,
    example: 'Product 1',
    description: 'Product name',
  })
  description: string;
  @ApiProperty({
    type: String,
    example: 'product-1.jpg',
    description: 'Product image',
  })
  image: string;
  @ApiProperty({
    type: [ImageInfoDto],
    example: [{ image: 'product-1.jpg', isMain: true }],
    description: 'Product price',
  })
  images: ImageInfoDto[];
  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Product price',
  })
  price: number;
  @ApiProperty({
    type: Number,
    example: 90,
    description: 'Product sale price',
  })
  priceSale: number;
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Product is on sale',
  })
  isSale: boolean;
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Category id',
  })
  categoryId: number;
  @ApiProperty({
    type: String,
    example: 'category',
    description: 'Category name',
  })
  category: string;
  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Product stock',
  })
  stock: number;
}
