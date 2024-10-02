import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './entities/permission.entity';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PermissionsService {
  constructor(private _prismaService: PrismaService) {}

  async create(permission: CreatePermissionDto): Promise<PermissionEntity> {
    try {
      const createdPermission = await this._prismaService.permission.create({
        data: permission,
      });

      return createdPermission;
    } catch (error) {
      throw new HttpException(
        'No se pudo crear el permiso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<PermissionEntity[]> {
    return await this._prismaService.permission.findMany({
      where: {
        state: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<PermissionEntity> {
    const permission = await this._prismaService.permission.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!permission)
      throw new HttpException(
        `Permiso con el id: ${id}, no existe`,
        HttpStatus.NOT_FOUND,
      );
    return permission;
  }

  async update(
    id: string,
    permission: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    return await this._prismaService.permission.update({
      where: {
        id: parseInt(id),
      },
      data: permission,
    });
  }

  async remove(id: string): Promise<HttpException> {
    const permissionExists = await this._prismaService.permission.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!permissionExists)
      throw new HttpException(
        `Permiso con el id:${id}, no existe`,
        HttpStatus.NOT_FOUND,
      );
    await this._prismaService.permission.update({
      where: {
        id: parseInt(id),
      },
      data: {
        state: false,
      },
    });
    return new HttpException(`Permiso:${id} eliminado`, HttpStatus.OK);
  }
}
