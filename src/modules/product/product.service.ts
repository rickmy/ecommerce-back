import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageInfoDto } from './dto/image-product.dto';
import { DetailProductDto } from './dto/detail-product.dto';
import { UploadFilesService } from '../upload-files/upload-files.service';

@Injectable()
export class ProductService {
  constructor(
    private _prismaService: PrismaService,
    private _uploadFileService: UploadFilesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    try {
      const isExist = await this._prismaService.product.findFirst({
        where: {
          code: createProductDto.code,
        },
      });

      if (isExist) {
        throw new HttpException(
          'Product with this code already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const product = await this._prismaService.product.create({
        data: {
          code: createProductDto.code,
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          priceSale: createProductDto.priceSale,
          isSale: createProductDto.isSale,
          categoryId: createProductDto.categoryId,
          images: JSON.stringify([]),
          tags: createProductDto.tags,
          stock: createProductDto.stock,
        },
        include: {
          category: true,
        },
      });

      if (!product) {
        throw new HttpException('Product not created', HttpStatus.BAD_REQUEST);
      }
      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        price: product.price,
        priceSale: product.priceSale,
        isSale: product.isSale,
        categoryId: product.categoryId,
        category: product.category.name,
        image: '',
        images: [],
        stock: product.stock,
      };
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
        where: {
          status: true,
        },
      });
      if (products.length === 0) {
        throw new HttpException('No products found', HttpStatus.NO_CONTENT);
      }
      return products.map((product) => {
        const images = this.parseImage(product.images as string);
        return {
          id: product.id,
          code: product.code,
          name: product.name,
          description: product.description,
          image: images.find((image) => image.isMain).image,
          images: images,
          price: product.price,
          priceSale: product.priceSale,
          isSale: product.isSale,
          categoryId: product.categoryId,
          category: product.category.name,
          stock: product.stock,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number): Promise<DetailProductDto> {
    try {
      if (!id)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

      const product = await this._prismaService.product.findFirst({
        where: {
          id: id,
        },
        include: {
          category: true,
          Review: true,
        },
      });

      if (!product)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

      const images = this.parseImage(product.images as string);
      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        price: product.price,
        priceSale: product.priceSale,
        isSale: product.isSale,
        categoryId: product.categoryId,
        category: product.category.name,
        image: images.find((image) => image.isMain).image,
        images: images,
        tags: product.tags,
        reviews: product.Review,
        stock: product.stock,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOneByCode(code: string) {
    try {
      const product = await this._prismaService.product.findFirst({
        where: {
          code: code,
        },
        include: {
          category: true,
          Review: true,
        },
      });

      if (!product)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

      const images = this.parseImage(product.images as string);
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        priceSale: product.priceSale,
        isSale: product.isSale,
        categoryId: product.categoryId,
        category: product.category.name,
        image: images.find((image) => image.isMain).image,
        images: images,
        tags: product.tags,
        reviews: product.Review,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async setImages(id: number, indexMain: number, files: Express.Multer.File[]) {
    try {
      const uploadImages = await this._uploadFileService.uploadImages(files);

      console.log(uploadImages);

      const imageInfoDto: ImageInfoDto[] = uploadImages.map((image, index) => {
        return {
          image: image.secure_url,
          isMain: index === indexMain,
        };
      });

      const product = await this._prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          images: JSON.stringify(imageInfoDto),
        },
        include: {
          category: true,
        },
      });

      if (!product) {
        throw new HttpException('Product not update', HttpStatus.BAD_REQUEST);
      }

      return {
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        price: product.price,
        priceSale: product.priceSale,
        isSale: product.isSale,
        categoryId: product.categoryId,
        category: product.category.name,
        image: imageInfoDto.find((image) => image.isMain).image,
        images: imageInfoDto,
        stock: product.stock,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateImages(
    id: number,
    indexMain: number,
    files: Express.Multer.File[],
  ) {
    try {
      const product = await this._prismaService.product.findFirst({
        where: {
          id: id,
        },
      });

      console.log(product);

      const uploadImages = await this._uploadFileService.uploadImages(files);

      console.log(uploadImages);

      const imageInfoDto: ImageInfoDto[] = uploadImages.map((image) => {
        return {
          image: image.secure_url,
          isMain: false,
        };
      });

      const productImages = [
        ...this.parseImage(product.images as string),
        ...imageInfoDto,
      ].map((image, index) => {
        return {
          image: image.image,
          isMain: index === indexMain,
        };
      });

      const productUpdate = await this._prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          images: JSON.stringify(productImages),
        },
        include: {
          category: true,
        },
      });

      if (!productUpdate) {
        throw new HttpException('Product not update', HttpStatus.BAD_REQUEST);
      }

      return {
        ...productUpdate,
        category: productUpdate.category.name,
        image: productImages.find((image) => image.isMain).image,
        images: productImages,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    try {
      const images = updateProductDto.images.map((image, index) => {
        return {
          image: image.image,
          isMain: index === updateProductDto.indexMainImage,
        };
      });

      const product = await this._prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          code: updateProductDto.code,
          name: updateProductDto.name,
          description: updateProductDto.description,
          price: updateProductDto.price,
          priceSale: updateProductDto.priceSale,
          isSale: updateProductDto.isSale,
          categoryId: updateProductDto.categoryId,
          tags: updateProductDto.tags,
          stock: updateProductDto.stock,
          images: JSON.stringify(images),
        },
        include: {
          category: true,
        },
      });

      if (!product) {
        throw new HttpException('Product not update', HttpStatus.BAD_REQUEST);
      }

      return {
        ...product,
        category: product.category.name,
        image: updateProductDto.images.find((image) => image.isMain).image,
        images: updateProductDto.images,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number) {
    try {
      await this._prismaService.product.update({
        where: {
          id: id,
        },
        data: {
          status: false,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  parseImage(images: string): ImageInfoDto[] {
    return JSON.parse(images) as ImageInfoDto[];
  }
}
