import { Review } from '@prisma/client';

export class ReviewEntity implements Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
