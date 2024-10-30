import { Prisma, Product } from '@prisma/client';

export class ProductEntity implements Product {
  id: number;
  code: string;
  name: string;
  description: string;
  images: Prisma.JsonArray;
  tags: string[];
  stock: number;
  price: number;
  priceSale: number;
  isSale: boolean;
  categoryId: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
