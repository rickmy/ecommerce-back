import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { CreateAcademicTutorDto } from './dto/create-tutor-academic.dto';
import { TutorEntity } from './entities/tutor.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateBussinesTutorDto } from './dto/create-tutor-bussiness.dto';
import { TutorAcademicDto } from './dto/tutor-academic.dto';
import { TutorBussinesDto } from './dto/tutor-bussines.dto';
import { TutorDto } from './dto/tutor.dto';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { Prisma } from '@prisma/client';

@Injectable()
export class TutorService {
  private logger = new Logger(TutorService.name);

  constructor(
    private _prismaService: PrismaService,
    private _userService: UserService,
    private _roleService: RoleService,
  ) {

  }
  create(createTutorDto: CreateTutorDto) {
    return 'This action adds a new tutor';
  }

  async createTutorAcademic(createTutorDto: CreateAcademicTutorDto): Promise<TutorEntity> {
    const role = await this._roleService.findByCode('TA');
    const newUser: CreateUserDto = {
      dni: createTutorDto.dni,
      userName: createTutorDto.email.split('@')[0],
      email: createTutorDto.email,
      password: createTutorDto.dni,
      idRol: role.id,
    };
    try {
      this.logger.log('Creando usuario correctamente')
      const user = await this._userService.create(newUser);
      this.logger.log('Usuario Creado correctamente')
      const tutor = await this._prismaService.tutor.create({
        data: {
          dni: createTutorDto.dni,
          firstName: createTutorDto.firstName,
          lastName: createTutorDto.lastName,
          email: createTutorDto.email,
          isAcademic: true,
          idUser: user.id,
          idCareer: createTutorDto.idCareer,
        },
      });
      this.logger.log('Tutor Creado correctamente')
      return tutor;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createTutorBusiness(createTutorDto: CreateBussinesTutorDto): Promise<TutorEntity> {
    const role = await this._roleService.findByCode('TE');
    const newUser: CreateUserDto = {
      dni: createTutorDto.dni,
      userName: createTutorDto.email.split('@')[0],
      email: createTutorDto.email,
      password: createTutorDto.dni,
      idRol: role.id,
    };
    try {
      this.logger.log('Creando usuario correctamente')
      const user = await this._userService.create(newUser);
      this.logger.log('Usuario Creado correctamente')
      const tutor = await this._prismaService.tutor.create({
        data: {
          dni: createTutorDto.dni,
          firstName: createTutorDto.firstName,
          lastName: createTutorDto.lastName,
          email: createTutorDto.email,
          isAcademic: false,
          idUser: user.id,
          idCompany: createTutorDto.idCompany,
        },
      });
      this.logger.log('Tutor Creado correctamente')
      return tutor;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  findAll(): Promise<TutorDto[]> {
    try {
      return this._prismaService.tutor.findMany({
        where: {
          state: true,
        },
      });

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllAcademic(idCareer:number, options: PaginationOptions, allActive?: boolean): Promise<TutorAcademicDto[]> {
    try {
      const tutors = await this._prismaService.tutor.findMany({
        where: {
          isAcademic: true,
          state: allActive ? true : undefined,
          idCareer,
          OR: options.name ? [
            {
              firstName: {
                contains: options.name ? options.name.toUpperCase() : undefined,
              },
            },
            {
              lastName: {
                contains: options.name ? options.name.toUpperCase() : undefined,
              },
            },
          ]: undefined,
          dni: {
            startsWith: options.identification ? options.identification : undefined,
          },
          email: {
            contains: options.email ? options.email : undefined,
          },
        },
        include: {
          career: true,
        },
      });
      if (!tutors || tutors.length === 0)
        return [];
      return tutors.map((tutor) => {
        return {
          id: tutor.id,
          dni: tutor.dni,
          firstName: tutor.firstName,
          lastName: tutor.lastName,
          email: tutor.email,
          career: tutor.career.name,
          idCareer: tutor.idCareer,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllBusiness(idCompany:number, options: PaginationOptions, allActive?: boolean): Promise<TutorBussinesDto[]> {
    try {
      const tutors = await this._prismaService.tutor.findMany({
        where: {
          isAcademic: false,
          state: allActive ? true : undefined,
          idCompany,
          OR: options.name ? [
            {
              firstName: {
                contains: options.name ? options.name : undefined,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: options.name ? options.name : undefined,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ]: undefined,
          dni: {
            startsWith: options.identification ? options.identification : undefined,
            mode: Prisma.QueryMode.insensitive,
          },
          email: {
            contains: options.email ? options.email : undefined,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        include: {
          company: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        }
      });
      if (!tutors || tutors.length === 0)
        return [];
      return tutors.map((tutor) => {
        return {
          id: tutor.id,
          dni: tutor.dni,
          firstName: tutor.firstName,
          lastName: tutor.lastName,
          email: tutor.email,
          company: tutor.company.name,
          idCompany: tutor.idCompany,
        };
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number): Promise<TutorEntity> {
    try {
      const tutor = await this._prismaService.tutor.findFirst({
        where: {
          id,
        },
        include: {
          career: true,
          company: true,
        }
      });
      if (!tutor)
        throw new HttpException('No se encontró el tutor', HttpStatus.NOT_FOUND);
      return tutor;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByIdUser(idUser: number): Promise<TutorEntity> {
    try {
      const tutor = await this._prismaService.tutor.findFirst({
        where: {
          idUser,
        },
      });
      if (!tutor)
      return null;
      return tutor;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateTutorDto: UpdateTutorDto): Promise<TutorEntity> {
    try {
      await this.findOne(id);
      const tutorUpdated = await this._prismaService.tutor.update({
        where: {
          id,
        },
        data: {
          ...updateTutorDto,
        }
      });
      return tutorUpdated;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number):Promise<HttpException> {
    try {
      const tutor = await this.findOne(id);
      await this._prismaService.tutor.update({
        where: {
          id,
        },
        data: {
          state: false,
        }
      });
      await this._userService.remove(tutor.idUser);
      return new HttpException('Tutor eliminado correctamente', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
