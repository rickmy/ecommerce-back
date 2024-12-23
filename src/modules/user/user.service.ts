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
import { RoleService } from '../role/role.service';
import { CreateClientDto } from './dto/create-user-client.dto';
import { v4 as uuidV4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    private _prismaService: PrismaService,
    private _roleService: RoleService,
    private _mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { dni, email } = createUserDto;
    const existDni = await this.findByDni(dni);
    if (existDni)
      throw new UnprocessableEntityException('El usuario ya existe');
    const existEmail = await this.findByEmail(email);
    if (existEmail)
      throw new UnprocessableEntityException('El usuario ya existe');
    const password = this.hashPassword(createUserDto.dni);
    try {
      this.logger.log('Creando usuario');
      const newUser = await this._prismaService.user.create({
        data: {
          name: createUserDto.name,
          lastName: createUserDto.lastName,
          dni: createUserDto.dni,
          email: createUserDto.email,
          password,
          phone: '',
          roleId: createUserDto.roleId,
        },
        include: {
          Role: true,
        },
      });
      this.logger.log('Usuario creado');
      if (!newUser)
        throw new UnprocessableEntityException('No se pudo crear el usuario');
      return {
        id: newUser.id,
        dni: newUser.dni,
        name: newUser.name,
        lastName: newUser.lastName,
        completeName: `${newUser.name} ${newUser.lastName}`,
        email: newUser.email,
        status: newUser.status,
        roleId: newUser.roleId,
        role: newUser.Role.name,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async createClient(createClientDto: CreateClientDto): Promise<ClientDto> {
    const { dni, email } = createClientDto;
    const existDni = await this.findByDni(dni);
    if (existDni)
      throw new UnprocessableEntityException('El usuario ya existe');
    const existEmail = await this.findByEmail(email);
    if (existEmail)
      throw new UnprocessableEntityException('El usuario ya existe');
    const role = await this._roleService.findRoleByName('Client');
    const uuid = uuidV4();
    this.logger.log(uuid);
    try {
      this.logger.log('Creando usuario');
      const newUser = await this._prismaService.user.create({
        data: {
          name: createClientDto.name,
          lastName: createClientDto.lastName,
          dni: createClientDto.dni,
          email: createClientDto.email,
          company: createClientDto.company,
          password: this.hashPassword(uuid),
          phone: createClientDto.phone,
          roleId: role.id,
        },
        include: {
          Role: true,
        },
      });
      if (!newUser)
        throw new UnprocessableEntityException('No se pudo crear el usuario');
      this.logger.log('Usuario creado');
      this._mailService.welcomeClient(newUser.name, newUser.email, uuid);
      return {
        id: newUser.id,
        dni: newUser.dni,
        name: newUser.name,
        lastName: newUser.lastName,
        completeName: !newUser.company
          ? `${newUser.name} ${newUser.lastName}`
          : `${newUser.company}`,
        company: newUser.company,
        email: newUser.email,
        phone: newUser.phone,
        status: newUser.status,
        roleId: newUser.roleId,
        role: newUser.Role.name,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, error.status);
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

      const role = await this._roleService.findRoleByName('Client');

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
          roleId: {
            not: role.id,
          },
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

      return {
        results: users.map((user) => {
          return {
            id: user.id,
            dni: user.dni,
            name: user.name,
            lastName: user.lastName,
            completeName: `${user.name} ${user.lastName}`,
            company: user.company,
            email: user.email,
            status: user.status,
            roleId: user.roleId,
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
      throw new HttpException(error, error.status);
    }
  }

  async findOne(id: number): Promise<UserDto> {
    try {
      const user = await this._prismaService.user.findUnique({
        where: {
          id,
        },
        include: { Role: true },
      });
      if (!user)
        throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
      return {
        id: user.id,
        dni: user.dni,
        name: user.name,
        lastName: user.lastName,
        completeName: `${user.name} ${user.lastName}`,
        email: user.email,
        status: user.status,
        roleId: user.roleId,
        role: user.Role.name,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllClients(
    options: PaginationOptions,
    allActive?: boolean,
  ): Promise<PaginationResult<ClientDto>> {
    try {
      const role = await this._roleService.findRoleByName('Client');
      if (!role) throw new UnprocessableEntityException('El rol no existe');
      const { page, limit } = options;

      const users = await this._prismaService.user.findMany({
        where: {
          roleId: role.id,
          status: true,
        },
        include: {
          Role: true,
        },
      });

      if (!users)
        throw new HttpException(
          'No se encontraron usuarios',
          HttpStatus.NOT_FOUND,
        );

      return {
        results: users.map((user) => {
          return {
            id: user.id,
            dni: user.dni,
            name: user.name,
            lastName: user.lastName,
            completeName: !user.company
              ? `${user.name} ${user.lastName}`
              : `${user.company}`,
            company: user.company,
            phone: user.phone,
            email: user.email,
            status: user.status,
            roleId: user.roleId,
            role: user.Role.name,
          };
        }),
        total: await this._prismaService.user.count({
          where: {
            roleId: role.id,
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

  async findOneClient(id: number): Promise<ClientDto> {
    return this._prismaService.user
      .findUnique({
        where: {
          id,
        },
        include: {
          Role: true,
        },
      })
      .then((user) => {
        if (!user)
          throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        return {
          id: user.id,
          dni: user.dni,
          name: user.name,
          lastName: user.lastName,
          completeName: !user.company
            ? `${user.name} ${user.lastName}`
            : `${user.company}`,
          company: user.company,
          phone: user.phone,
          email: user.email,
          status: user.status,
          roleId: user.roleId,
          role: user.Role.name,
        };
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
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

  async updateClient(
    id: number,
    createClientDto: CreateClientDto,
  ): Promise<ClientDto> {
    try {
      const user = await this.findOneClient(id);
      if (!user) throw new UnprocessableEntityException('El usuario no existe');
      const updatedUser = await this._prismaService.user.update({
        where: {
          id,
        },
        data: {
          name: createClientDto.name,
          lastName: createClientDto.lastName,
          dni: createClientDto.dni,
          email: createClientDto.email,
          company: createClientDto.company,
          phone: createClientDto.phone,
        },
        include: { Role: true },
      });
      return {
        id: updatedUser.id,
        dni: updatedUser.dni,
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        completeName: !updatedUser.company
          ? `${updatedUser.name} ${updatedUser.lastName}`
          : `${updatedUser.company}`,
        company: updatedUser.company,
        email: updatedUser.email,
        phone: updatedUser.phone,
        status: updatedUser.status,
        roleId: updatedUser.roleId,
        role: updatedUser.Role.name,
      };
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
