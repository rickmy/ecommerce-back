import { ApiProperty } from '@nestjs/swagger';

export class ImageInfoDto {
  @ApiProperty({ type: String, example: 'product-1.jpg', description: 'Image' })
  image: string;
  @ApiProperty({ type: Boolean, example: true, description: 'Is main image' })
  isMain: boolean;
}
