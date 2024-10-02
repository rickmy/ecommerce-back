import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyEntity } from './entities/company.entity';
import { Prisma, StatusCompany, StatusProject } from '@prisma/client';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { CompaniesInfoDto } from './dto/companies-info.dto';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';


@Injectable()
export class CompanyService {
  private logger = new Logger(CompanyService.name);

  constructor(
    private _prismaService: PrismaService,
    private _roleService: RoleService,
    private _userService: UserService,
  ) { }

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const role = await this._roleService.findByCode('CE');
    const newUser: CreateUserDto = {
      dni: createCompanyDto.ruc,
      userName: createCompanyDto.ruc,
      email: createCompanyDto.email,
      password: createCompanyDto.ruc,
      idRol: role.id,
    };
    try {
      const user = await this._userService.create(newUser);
      this.logger.log('Usuario Creado correctamente')
      const company = await this._prismaService.company.create({
        data: {
          ruc: createCompanyDto.ruc,
          name: createCompanyDto.name,
          dniRepresentLegal: createCompanyDto.dniRepresentLegal,
          nameRepresentLegal: createCompanyDto.nameRepresentLegal,
          lastNameRepresentLegal: createCompanyDto.lastNameRepresentLegal,
          phone: createCompanyDto.phone,
          address: createCompanyDto.address,
          email: createCompanyDto.email,
          status: StatusCompany.ACTIVO,
          idCareer: createCompanyDto.idCareer,
          idUser: user.id,
        },
      });
      return company;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }

  }

  async updateStatusCompany(
    id: number,
    status: StatusCompany,
  ): Promise<CompanyEntity> {
    try {
      const company = await this._prismaService.company.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
      return company;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll( idCareer: number, options: PaginationOptions,
    allActive?: boolean,
   ): Promise<PaginationResult<CompanyEntity>> {

    const { page, limit } = options;

    const hasFilter = !!options.name || !!options.identification || !!options.email;
    try {
      const companies = await this._prismaService.company.findMany({
        where: {
          state: allActive ? undefined : true,
          idCareer: idCareer ? idCareer : undefined,
          name: {
            contains: options.name ? options.name : undefined,
            mode: Prisma.QueryMode.insensitive,
          },
          ruc: {
            startsWith: options.identification ? options.identification : undefined,
            mode: Prisma.QueryMode.insensitive,
          },
          email: {
            contains: options.email ? options.email : undefined,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });
      return {
        results: companies,
        limit,
        page,
        total: await this._prismaService.company.count({
          where: {
            state: allActive ? true : undefined
          },
        }),
      };
    } catch (error) {

    }
  }

  async findOne(id: number): Promise<CompanyEntity> {
    const company = await this._prismaService.company.findUnique({
      where: {
        id: id,
      },
    });
    if (!company)
      throw new HttpException(
        `Empresa con el id: ${id}, no existe`,
        HttpStatus.NOT_FOUND,
      );
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {

    const companyExists = await this.findOne(id);
    if (!companyExists) {
      throw new HttpException('La empresa no existe', HttpStatus.NOT_FOUND);
    }
    try {
      return await this._prismaService.company.update({
        where: {
          id: id,
        },
        data: updateCompanyDto,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOneCompanyInfo(id: string): Promise<CompaniesInfoDto> {
    try {
      const company = await this._prismaService.company.findFirst({
        where: {
          id: parseInt(id),
        },
        select: {
          id: true,
          ruc: true,
          name: true,
          email: true,
          address: true,
          phone: true,
          status: true,
          dniRepresentLegal: true,
          nameRepresentLegal: true,
          lastNameRepresentLegal: true,
        }
      });
      if (!company) {
        throw new HttpException('La empresa no existe', HttpStatus.NOT_FOUND);
      }
      const projects = await this._prismaService.project.findMany({
        where: {
          idCompany: company.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
        },
      });
      const agreements = await this._prismaService.agreement.findMany({
        where: {
          idCompany: company.id,
        },
        select: {
          id: true,
          code: true,
          dateStart: true,
          dateEnd: true,
          status: true,
        },
      });
      return {
        ...company,
        agreements: agreements,
        projects: projects,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async remove(id: number): Promise<HttpException> {
    try {
      const company = await this.findOne(id);
      if (!company) {
        throw new HttpException('La empresa no existe', HttpStatus.NOT_FOUND);
      }
      await this._prismaService.company.update({
        where: {
          id: id,
        },
        data: {
          state: false,
        },
      });
      await this._userService.remove(company.idUser);

      await this._prismaService.agreement.updateMany({
        where: {
          idCompany: id,
        },
        data: {
          state: false,
          status: StatusProject.INACTIVO,
        },
      });

      await this._prismaService.project.updateMany({
        where: {
          idCompany: id,
        },
        data: {
          state: false,
          status: StatusProject.INACTIVO,
        },
      });

      const registrationToUpdate = await this._prismaService.studentAssignedToCompany.findMany({
        where: {
          idCompany: id,
        }
      });

      await this._prismaService.studentAssignedToCompany.updateMany({
        where: {
          id: {
            in: registrationToUpdate.map((registration) => registration.id),
          },
        },
        data: {
          idCompany: null,
          idProject: null,
        },
      });


      return new HttpException('La empresa ha sido eliminada', HttpStatus.OK);

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

}
