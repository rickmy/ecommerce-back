import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleEntity } from './entities/role.entity';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  private logger = new Logger(RoleService.name);
  constructor(private _prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<HttpException> {
    const { name } = createRoleDto;
    const roleExist = await this._prismaService.role.findFirst({
      where: {
        OR: [
          {
            name,
          },
        ],
      },
    });
    if (roleExist)
      throw new HttpException('El rol ya existe', HttpStatus.BAD_REQUEST);
    const role = await this._prismaService.role.create({
      data: {
        name,
      },
    });
    if (!role)
      throw new HttpException(
        'Error al crear el rol',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return new HttpException('Rol creado correctamente', HttpStatus.CREATED);
  }

  async findAll(
    options: PaginationOptions,
    allActive?: boolean,
  ): Promise<PaginationResult<RoleEntity>> {
    try {
      const { page, limit } = options;

      const optionsWhere = {
        state: allActive ? true : undefined,
        name: options.name ? { contains: options.name } : undefined,
        code: options.identification
          ? { contains: options.identification }
          : undefined,
      };

      const hasFilter = !!options.name || !!options.identification;

      const roles = await this._prismaService.role.findMany({
        where: optionsWhere,
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });

      const total = await this._prismaService.role.count({
        where: optionsWhere,
      });

      if (!roles || roles.length === 0)
        return new PaginationResult<RoleEntity>([], total, page, limit);

      return new PaginationResult<RoleEntity>(roles, total, page, limit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number) {
    try {
      return await this._prismaService.role.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findRoleByName(name: string): Promise<RoleEntity> {
    try {
      const role = await this._prismaService.role.findFirst({
        where: {
          name: {
            contains: name,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      });
      if (!role)
        throw new HttpException('El rol no existe', HttpStatus.NOT_FOUND);
      this.logger.log('Rol encontrado');
      return role;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const { name } = updateRoleDto;
    try {
      return await this._prismaService.role.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number): Promise<HttpException> {
    try {
      await this._prismaService.role.update({
        where: {
          id,
        },
        data: {
          status: false,
        },
      });
      return new HttpException('Rol eliminado correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
