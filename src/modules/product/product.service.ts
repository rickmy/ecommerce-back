import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageInfoDto } from './dto/image-product.dto';

@Injectable()
export class ProductService {
  constructor(private _prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this._prismaService.product.create();

      if (!product) {
        throw new HttpException('Product not created', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(): Promise<ProductDto[]> {
    try {
      const products = await this._prismaService.product.findMany({
        include: {
          category: true,
        },
      });
      if (products.length === 0) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      console.log(products);
      return products.map((product) => {
        const images = product.images as unknown as ImageInfoDto[];
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          image: images.find((image) => image.isMain).image,
          images: images,
          price: product.price,
          priceSale: product.priceSale,
          isSale: product.isSale,
          categoryId: product.categoryId,
          category: product.category.name,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
