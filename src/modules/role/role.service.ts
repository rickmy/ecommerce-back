import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleWithPermission } from './dto/roleWithPermission.dto';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { RoleEntity } from './entities/role.entity';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';

@Injectable()
export class RoleService {
  private logger = new Logger(RoleService.name);
  constructor(private _prismaService: PrismaService) { }

  async create(createRoleDto: CreateRoleDto): Promise<HttpException> {
    const { code, name, permissions } = createRoleDto;
    const roleExist = await this._prismaService.rol.findFirst({
      where: {
        OR: [
          {
            code,
          },
          {
            name,
          }
        ]
      },
    });
    if(roleExist) throw new HttpException('El rol ya existe', HttpStatus.BAD_REQUEST);
    const role = await this._prismaService.rol.create({
      data: {
        code,
        name,
      },
    });
    if (!role) throw new HttpException('Error al crear el rol', HttpStatus.UNPROCESSABLE_ENTITY);
    const rolHasPermission = permissions.map((permission) => {
      return {
        idPermission: permission.id,
        idRol: role.id,
      };
    });
    const rolesWithPermission =
      await this._prismaService.rolHasPermission.createMany({
        data: rolHasPermission,
      });
    if (!rolesWithPermission)
      throw new HttpException('Error al enlazar el rol con sus permisos', HttpStatus.UNPROCESSABLE_ENTITY);
    return new HttpException('Rol creado correctamente', 201);
  }

  async findAll(options: PaginationOptions, allActive?: boolean): Promise<PaginationResult<RoleEntity>> {
    try {
      const { page, limit } = options;

      const optionsWhere = {
        state: allActive ? true : undefined,
        name: options.name ? { contains: options.name } : undefined,
        code: options.identification ? { contains: options.identification } : undefined,
      };

      const hasFilter = !!options.name || !!options.identification;

      const roles = await this._prismaService.rol.findMany({
        where: optionsWhere,
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });

      const total = await this._prismaService.rol.count({
        where: optionsWhere,
      });

      if(!roles || roles.length === 0)  return new PaginationResult<RoleEntity>([], total, page, limit);

      return new PaginationResult<RoleEntity>(roles, total, page, limit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number) {
    try {
      return await this._prismaService.rol.findFirstOrThrow({
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
      let nameRole = '%' + name + '%';
      const role = await this._prismaService.$queryRaw<RoleEntity>`SELECT * FROM "Rol" WHERE name LIKE ${nameRole}`;
      if (!role) throw new HttpException('El rol no existe', 404);
      this.logger.log('Rol encontrado');
      return role;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByCode(code: string): Promise<RoleEntity> {
    try {
      const role = await this._prismaService.rol.findFirst({
        where: {
          code,
        },
      });
      if (!role) throw new HttpException('El rol no existe', 404);
      this.logger.log('Rol encontrado');
      return role;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findRoleWithPermissions(
    id: number,
    all?: boolean,
  ): Promise<RoleWithPermission> {
    const role = await this.findOne(id);
    let permissionsWithRole = [];
    try {
      permissionsWithRole = await this._prismaService.rolHasPermission.findMany(
        {
          where: {
            idRol: id,
            state: all ? undefined : true,
          },
          include: {
            permission: true,
          },
        },
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
    const permissions: PermissionEntity[] = permissionsWithRole.map(
      (permission) => {
        return {
          ...permission.permission,
        };
      },
    );
    return {
      role,
      permissions,
    };
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleWithPermission> {

    const { permissions } = updateRoleDto;

    const roleUpdate = await this.updateOnlyRole(id, updateRoleDto);

    if (!roleUpdate) throw new NotFoundException('Error al actualizar el rol');

    const permissionDB = (await this.findRoleWithPermissions(id, true))
      .permissions;

    const permissionDelete = permissionDB.filter((permission) => {
      return !permissions.some((permissionUpdate) => {
        return permissionUpdate.id === permission.id && permissionUpdate.state;
      });
    });

    const permissionCreate = permissions.filter((permission) => {
      return !permissionDB.some((permissionUpdate) => {
        return permissionUpdate.id === permission.id;
      });
    });

    if (permissionDelete.length > 0) {
      try {
        await this._prismaService.rolHasPermission.updateMany({
          where: {
            idRol: id,
            idPermission: {
              in: permissionDelete.map((permission) => permission.id),
            },
          },
          data: {
            state: false,
          },
        });
      } catch (error) {
        throw new HttpException(error.message, error.status);
      }
    }
    if (permissionCreate.length > 0) {
      const rolHasPermission = permissionCreate.map((permission) => {
        return {
          idPermission: permission.id,
          idRol: id,
        };
      });

      try {
        await this._prismaService.rolHasPermission.createMany({
          data: rolHasPermission,
        });
      } catch (error) {
        throw new HttpException(error.message, error.status);
      }
    }
    return await this.findRoleWithPermissions(id);
  }

  async updateOnlyRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    const { name } = updateRoleDto;
    try {
      return await this._prismaService.rol.update({
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
      await this._prismaService.rol.update({
        where: {
          id,
        },
        data: {
          state: false,
        },
      });
      return new HttpException('Rol eliminado correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async validatePermission(idRole:number, route: string): Promise<boolean> {
    const roleWithPermission = await this.findRoleWithPermissions(idRole, true);
    return roleWithPermission.permissions.some((permission) => {
      return permission.endpoint === route;
    });
  }
}
