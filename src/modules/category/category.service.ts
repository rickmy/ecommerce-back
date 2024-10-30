import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private _prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this._prismaService.category.create({
        data: createCategoryDto,
      });
      if (!category)
        throw new HttpException(
          'Error al crear la categoría',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      return category;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      const categories = await this._prismaService.category.findMany();
      if (categories.length === 0) {
        throw new HttpException('No hay categorías', HttpStatus.NOT_FOUND);
      }
      return categories;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this._prismaService.category.findUnique({
        where: {
          id: id,
        },
      });
      if (!category) {
        throw new HttpException(
          'Categoría no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return category;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.findOne(id);

      const category = await this._prismaService.category.update({
        where: { id: id },
        data: updateCategoryDto,
      });

      if (!category) {
        throw new HttpException(
          'Error al actualizar la categoría',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number) {
    try {
      return await this._prismaService.category.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
