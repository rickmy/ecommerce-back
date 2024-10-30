import {
  Injectable,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PayloadModel } from 'src/auth/models/payloadModel';
import { UserDto } from './dto/user.dto';
import { PaginationResult } from 'src/core/models/paginationResult';
import { PaginationOptions } from 'src/core/models/paginationOptions';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(private _prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const { dni, email } = createUserDto;
    const existDni = await this.findByDni(dni);
    if (existDni)
      throw new UnprocessableEntityException('El usuario ya existe');
    const existEmail = await this.findByEmail(email);
    if (existEmail)
      throw new UnprocessableEntityException('El usuario ya existe');
    createUserDto.password = this.hashPassword(createUserDto.password);
    try {
      this.logger.log('Creando usuario');
      const newUser = this._prismaService.user.create({
        data: createUserDto,
      });
      this.logger.log('Usuario creado');
      return newUser;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(password, storedPasswordHash);
  }

  async validateUser(payload: PayloadModel): Promise<boolean> {
    const user = await this.findByEmail(payload.email);
    return user ? true : false;
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  async findAll(
    options: PaginationOptions,
    allActive?: boolean,
  ): Promise<PaginationResult<UserDto>> {
    try {
      const { page, limit } = options;

      const hasFilter =
        !!options.name || !!options.identification || !!options.email;

      const users = await this._prismaService.user.findMany({
        where: {
          status: allActive ? true : undefined,
          name: hasFilter
            ? {
                contains: options.name,
                mode: Prisma.QueryMode.insensitive,
              }
            : undefined,
          dni: hasFilter
            ? {
                contains: options.identification,
                mode: Prisma.QueryMode.insensitive,
              }
            : undefined,
          email: hasFilter
            ? {
                contains: options.email,
                mode: Prisma.QueryMode.insensitive,
              }
            : undefined,
        },
        include: {
          Role: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });

      if (!users)
        throw new HttpException(
          'No se encontraron usuarios',
          HttpStatus.NO_CONTENT,
        );
      return {
        results: users.map((user) => {
          delete user.password;
          return {
            id: user.id,
            dni: user.dni,
            completeName: `${user.name} ${user.lastName}`,
            email: user.email,
            status: user.status,
            role: user.Role.name,
          };
        }),
        total: await this._prismaService.user.count({
          where: {
            status: allActive ? true : undefined,
          },
        }),
        page,
        limit,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findOne(id: number) {
    console.log('id', id);
    try {
      const user = await this._prismaService.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          dni: true,
          name: true,
          email: true,
          Role: {
            select: {
              id: true,
              name: true,
            },
          },
          company: true,
          status: true,
          Address: true,
        },
      });
      if (!user)
        throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAllByRole(idRol: number): Promise<UserDto[]> {
    try {
      const users = await this._prismaService.user.findMany({
        where: {
          roleId: idRol,
          status: true,
        },
        include: {
          Role: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!users)
        throw new HttpException(
          'No se encontraron usuarios',
          HttpStatus.NOT_FOUND,
        );

      return users.map((user) => {
        delete user.password;
        return {
          id: user.id,
          dni: user.dni,
          completeName: `${user.name} ${user.lastName}`,
          email: user.email,
          status: user.status,
          role: user.Role.name,
        };
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findByEmail(email: string) {
    return await this._prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        Role: {
          select: {
            name: true,
            status: true,
          },
        },
      },
    });
  }

  async findByDni(dni: string) {
    return await this._prismaService.user.findUnique({
      where: {
        dni,
      },
    });
  }

  async changeRole(id: number, idRole: number) {
    try {
      const user = await this.findOne(id);
      if (!user) throw new UnprocessableEntityException('El usuario no existe');
      const updatedUser = await this._prismaService.user.update({
        where: {
          id,
        },
        data: {
          roleId: idRole,
        },
      });
      if (!updatedUser)
        throw new UnprocessableEntityException('No se pudo actualizar el rol');
      return updatedUser;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) throw new UnprocessableEntityException('El usuario no existe');
    try {
      const updatedUser = await this._prismaService.user.update({
        where: {
          id,
        },
        data: {
          name: updateUserDto.name,
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async updatePassword(id: number, password: string): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) throw new UnprocessableEntityException('El usuario no existe');
    try {
      const updatedUser = await this._prismaService.user.update({
        where: {
          id,
        },
        data: {
          password: this.hashPassword(password),
        },
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async remove(id: number) {
    try {
      return await this._prismaService.user.update({
        where: {
          id,
        },
        data: {
          status: false,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
