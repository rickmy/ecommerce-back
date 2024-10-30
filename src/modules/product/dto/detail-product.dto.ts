import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { ReviewEntity } from '../entities/review.entity';

export class DetailProductDto extends ProductDto {
  @ApiProperty({
    type: Array<ReviewEntity>,
    example: [{ id: 1, rating: 5, comment: 'Good product' }],
    description: 'Product rating',
  })
  reviews: ReviewEntity[];
  @ApiProperty({
    type: [String],
    example: ['tag1', 'tag2'],
    description: 'Product tags',
  })
  tags: string[];
}
