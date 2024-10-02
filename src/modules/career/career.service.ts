import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CareerDto } from './dto/career.dto';
import { CareerEntity } from './entities/career.entity';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { TutorService } from '../tutor/tutor.service';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { Prisma } from '@prisma/client';
import { PaginationResult } from 'src/core/models/paginationResult';

@Injectable()
export class CareerService {
  private logger = new Logger(CareerService.name);
  constructor(
    private _prismaService: PrismaService,
    private _roleService: RoleService,
    private _userService: UserService,
    private _tutorService: TutorService,
  ) { }
  async create(createCareerDto: CreateCareerDto): Promise<CareerDto> {
    try {
      const careerExist = await this.findByCode(createCareerDto.code);
      if (careerExist)
        throw new HttpException(
          'La carrera ya existe',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      if (createCareerDto.idCoordinator === createCareerDto.idViceCoordinator || createCareerDto.idCoordinator === createCareerDto.idRespStepDual || createCareerDto.idViceCoordinator === createCareerDto.idRespStepDual)
        throw new HttpException(
          'Los coordinadores no pueden ser iguales',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      const roleCA = await this._roleService.findByCode('CA');

      const career = await this._prismaService.career.create({
        data: {
          ...createCareerDto,
        },
      });

      if (!career)
        throw new HttpException(
          'No se pudo crear la carrera',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      await this._userService.changeRole(career.idCoordinator, roleCA.id);
      await this._userService.changeRole(career.idViceCoordinator, roleCA.id);
      await this._userService.changeRole(career.idRespStepDual, roleCA.id);

      const coorAcademic = {
        tutor: await this._tutorService.findByIdUser(career.idCoordinator),
        user: await this._userService.findOne(career.idCoordinator),
      };
      if (!coorAcademic.tutor) {
        await this._prismaService.tutor.create({
          data: {
            dni: coorAcademic.user.dni,
            firstName: coorAcademic.user.userName,
            lastName: coorAcademic.user.userName,
            email: coorAcademic.user.email,
            idCareer: career.id,
            isAcademic: true,
            idUser: coorAcademic.user.id,
          },
        });
      } else {
        await this._tutorService.update(coorAcademic.tutor.id, {
          idCareer: career.id,
        })
      }
      const viceCoorAcademic = {
        tutor: await this._tutorService.findByIdUser(career.idViceCoordinator),
        user: await this._userService.findOne(career.idViceCoordinator),
      }
      if (!viceCoorAcademic.tutor) {
        await this._prismaService.tutor.create({
          data: {
            dni: viceCoorAcademic.user.dni,
            firstName: viceCoorAcademic.user.userName,
            lastName: viceCoorAcademic.user.userName,
            email: viceCoorAcademic.user.email,
            idCareer: career.id,
            isAcademic: true,
            idUser: viceCoorAcademic.user.id,
          },
        });
      } else {
        await this._tutorService.update(viceCoorAcademic.tutor.id, {
          idCareer: career.id,
        })
      }
      const respStepDual = {
        tutor: await this._tutorService.findByIdUser(career.idRespStepDual),
        user: await this._userService.findOne(career.idRespStepDual),
      }
      if (!respStepDual.tutor) {
        await this._prismaService.tutor.create({
          data: {
            dni: respStepDual.user.dni,
            firstName: respStepDual.user.userName,
            lastName: respStepDual.user.userName,
            email: respStepDual.user.email,
            idCareer: career.id,
            isAcademic: true,
            idUser: respStepDual.user.id,
          },
        });
      } else {
        await this._tutorService.update(respStepDual.tutor.id, {
          idCareer: career.id,
        })
      }

      return career;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll(){
    try {
      return this._prismaService.career.findMany({
        where: {
          state: true,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllCareers(options: PaginationOptions, allActive?: boolean): Promise<PaginationResult<CareerDto>> {
    const { page, limit } = options;
    const hasFilter = !!options.name || !!options.identification;

    const optionsWhere = {
      state: allActive ? true : undefined,
      name: options.name ? { contains: options.name } : undefined,
      code: options.identification ? { contains: options.identification } : undefined,
    };
    try {
      const careersDB = await this._prismaService.career.findMany({
        where: optionsWhere,
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });
      const total = await this._prismaService.career.count({
        where: optionsWhere,
      });
      if (!careersDB || careersDB.length === 0)
        return new PaginationResult<CareerEntity>([], total, page, limit); 
      this.logger.log('Carreras encontradas correctamente');
      return new PaginationResult<CareerEntity>(careersDB, total, page, limit);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number): Promise<CareerDto> {
    try {
      const careerDB = await this._prismaService.career.findUnique({
        where: {
          id: id,
        },
      });
      if (!careerDB)
        throw new HttpException(
          'No se encontró la carrera',
          HttpStatus.NOT_FOUND,
        );
      const careerDto: CareerDto = {
        ...careerDB,
      };
      return careerDto;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByCode(code: string): Promise<CareerEntity> {
    try {
      const careerDB = await this._prismaService.career.findUnique({
        where: {
          code: code,
        },
      });
      return careerDB;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updateCareerDto: UpdateCareerDto,
  ): Promise<CareerDto> {
    try {
      const roleCA = await this._roleService.findByCode('CA');
      const roleTA = await this._roleService.findByCode('TA');

      if (updateCareerDto.idCoordinator === updateCareerDto.idViceCoordinator || updateCareerDto.idCoordinator === updateCareerDto.idRespStepDual || updateCareerDto.idViceCoordinator === updateCareerDto.idRespStepDual)
        throw new HttpException(
          'Los coordinadores no pueden ser iguales',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      const careerDB = await this._prismaService.career.findUnique({
        where: {
          id: id,
        },
      });
      if (!careerDB)
        throw new HttpException(
          'No se encontró la carrera',
          HttpStatus.NOT_FOUND,
        );
      const career = await this._prismaService.career.update({
        where: {
          id: id,
        },
        data: {
          ...updateCareerDto,
        },
      });
      if (!career)
        throw new HttpException(
          'No se pudo actualizar la carrera',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      await this._userService.changeRole(careerDB.idCoordinator, roleTA.id);
      await this._userService.changeRole(careerDB.idViceCoordinator, roleTA.id);
      await this._userService.changeRole(careerDB.idRespStepDual, roleTA.id);

      await this._userService.changeRole(career.idCoordinator, roleCA.id);
      await this._userService.changeRole(career.idViceCoordinator, roleCA.id);
      await this._userService.changeRole(career.idRespStepDual, roleCA.id);

      return career;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number) {
    try {
      const careerDB = await this._prismaService.career.findUnique({
        where: {
          id: id,
        },
      });
      if (!careerDB)
        throw new HttpException(
          'No se encontró la carrera',
          HttpStatus.NOT_FOUND,
        );
      const career = await this._prismaService.career.update({
        where: {
          id: id,
        },
        data: {
          state: false,
        },
      });
      if (!career)
        throw new HttpException(
          'No se pudo eliminar la carrera',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      return new HttpException(
        'Carrera eliminada correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
