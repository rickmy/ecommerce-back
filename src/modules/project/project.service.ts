import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectEntity } from './entities/project.entity';
import { StudentsService } from '../students/students.service';
import { Prisma } from '@prisma/client';
import { TutorService } from '../tutor/tutor.service';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';
import { ProjectDto } from './dto/project.dto';
import { ProjectInfoDto } from './dto/project-info.dto';

@Injectable()
export class ProjectService {

  constructor(
    private _prismaService: PrismaService,
    private _studentService: StudentsService,
    private _tutorService: TutorService

  ) { }
  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    try {
      const projectExists = await this._prismaService.project.findFirst({
        where: {
          name: {
            equals: createProjectDto.name,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      });

      if (projectExists) 
        throw new HttpException(
          'Ya existe un proyecto con ese nombre',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      
      const project = await this._prismaService.project.create({
        data: {
          name: createProjectDto.name,
          description: createProjectDto.description,
          status: createProjectDto.status,
          idBusinessTutor: createProjectDto.idBusinessTutor,
          idCompany: createProjectDto.idCompany,
        },
      });
      return project;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(
    idCompany: number,
    options: PaginationOptions,
    allActive?: boolean
  ): Promise<PaginationResult<ProjectDto>> {

    const { page, limit } = options;

    const hasFilter = !!options.name || !!options.company || !!options.tutorAcademic || !!options.tutorBusiness;

    try {
      const projects = await this._prismaService.project.findMany({
        where: {
          state: allActive ? true : undefined,
          idCompany: idCompany ? idCompany : undefined,
          name: !!options.name ? { contains: options.name, mode: Prisma.QueryMode.insensitive } : undefined,
          company: !!options.company ? { name: { contains: options.company, mode: Prisma.QueryMode.insensitive } } : undefined,
          academicTutor: !!options.tutorAcademic ? { firstName: { contains: options.tutorAcademic, mode: Prisma.QueryMode.insensitive }, lastName: { contains: options.tutorAcademic, mode: Prisma.QueryMode.insensitive } } : undefined,
          businessTutor: !!options.tutorBusiness ? { firstName: { contains: options.tutorBusiness, mode: Prisma.QueryMode.insensitive }, lastName: { contains: options.tutorBusiness, mode: Prisma.QueryMode.insensitive } } : undefined,
        },
        include: {
          company: true,
          academicTutor: true,
          businessTutor: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });

      if (!projects || projects.length === 0) {
        return {
          results: [],
          page: page,
          limit: limit,
          total: 0,
        };
      }
      return {
        results: projects.map((project) => {
          return {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            idCompany: project.idCompany,
            company: project.company.name,
            idAcademicTutor: project.idAcademicTutor,
            academicTutor:  project.academicTutor != null ? `${project.academicTutor?.firstName} ${project.academicTutor?.lastName}` : null,
            idBusinessTutor: project.idBusinessTutor,
            businessTutor: `${project.businessTutor.firstName} ${project.businessTutor.lastName}`,
          };
        }),
        page: page,
        limit: limit,
        total: await this._prismaService.project.count({
          where: {
            state: allActive ? true : undefined,
          }
        }),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }

  }

  async findAllByCareer(
    idCareer: number,
    options: PaginationOptions,
    allActive?: boolean
  ): Promise<PaginationResult<ProjectDto>> {
  
    const { page, limit } = options;
  
    const hasFilter = !!options.name || !!options.company || !!options.tutorAcademic || !!options.tutorBusiness;
  
    try {
      const projects = await this._prismaService.project.findMany({
        where: {
          state: allActive ? true : undefined,
          company: {
            career: {
              id: idCareer ? idCareer : undefined,
            },
          },
          name: !!options.name ? { contains: options.name, mode: Prisma.QueryMode.insensitive } : undefined,
          academicTutor: !!options.tutorAcademic ? { firstName: { contains: options.tutorAcademic, mode: Prisma.QueryMode.insensitive }, lastName: { contains: options.tutorAcademic, mode: Prisma.QueryMode.insensitive } } : undefined,
          businessTutor: !!options.tutorBusiness ? { firstName: { contains: options.tutorBusiness, mode: Prisma.QueryMode.insensitive }, lastName: { contains: options.tutorBusiness, mode: Prisma.QueryMode.insensitive } } : undefined,
        },
        include: {
          company: true,
          academicTutor: true,
          businessTutor: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });
  
      if (!projects || projects.length === 0) {
        return {
          results: [],
          page: page,
          limit: limit,
          total: 0,
        };
      }
      return {
        results: projects.map((project) => {
          return {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            idCompany: project.idCompany,
            company: project.company.name,
            idAcademicTutor: project.idAcademicTutor,
            academicTutor:  project.academicTutor != null ? `${project.academicTutor?.firstName} ${project.academicTutor?.lastName}` : null,
            idBusinessTutor: project.idBusinessTutor,
            businessTutor: `${project.businessTutor.firstName} ${project.businessTutor.lastName}`,
          };
        }),
        page: page,
        limit: limit,
        total: await this._prismaService.project.count({
          where: {
            state: allActive ? true : undefined,
            company: {
              career: {
                id: idCareer ? idCareer : undefined,
              },
            },
          },
        }),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  
  async assignAcademicTutor(idProject: number, idAcademicTutor: number): Promise<ProjectEntity> {
    const project = await this.findOne(idProject);
    if (!project) {
      throw new HttpException('El proyecto no existe', HttpStatus.NOT_FOUND);
    }
    const academicTutor = await this._tutorService.findOne(idAcademicTutor);
    if (!academicTutor) {
      throw new HttpException('El tutor academico no existe', HttpStatus.NOT_FOUND);
    }
    try {
      return await this._prismaService.project.update({
        where: {
          id: idProject,
        },
        data: {
          idAcademicTutor: idAcademicTutor,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findProjectInfoById(id: number): Promise<ProjectInfoDto> {
    try {
      const project = await this._prismaService.project.findUnique({
        where: { id: id },
        include: {
          academicTutor: { select: { id: true, firstName: true, lastName: true } },
          businessTutor: { select: { id: true, firstName: true, lastName: true } },
          studentAssignedToCompany: {
            select: {
              id: true,
              academicPeriod: true,
              student: { select: { id: true, firstName: true, lastName: true, dni: true } },
            },
          },
          company: {select: {id:true, name:true, ruc: true}}
        },
      });

      if (!project) {
        throw new HttpException('Proyecto no encontrado', HttpStatus.NOT_FOUND);
      }

      const projectInfo: ProjectInfoDto = {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        businessTutor: {
          id: project.businessTutor?.id,
          firstName: project.businessTutor?.firstName,
          lastName: project.businessTutor?.lastName,
        },
        academicTutor: {
          id: project.academicTutor?.id,
          firstName: project.academicTutor?.firstName,
          lastName: project.academicTutor?.lastName,
        },
        company: {
          id: project.company?.id,
          name: project.company?.name,
          ruc: project.company.ruc,
        },
        students: project.studentAssignedToCompany.map((student) => ({
          id: student.student.id,
          fullName: `${student.student.firstName} ${student.student.lastName}`,
          dni: student.student.dni,
          academicPeriod: student.academicPeriod,
        })),
      };

      return projectInfo;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async assignBusinessTutor(idProject: number, idBusinessTutor: number): Promise<ProjectEntity> {
    const project = await this.findOne(idProject);
    if (!project) {
      throw new HttpException('El proyecto no existe', HttpStatus.NOT_FOUND);
    }
    const businessTutor = await this._tutorService.findOne(idBusinessTutor);
    if (!businessTutor) {
      throw new HttpException('El tutor empresarial no existe', HttpStatus.NOT_FOUND);
    }
    try {
      return await this._prismaService.project.update({
        where: {
          id: idProject,
        },
        data: {
          idBusinessTutor: idBusinessTutor,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async assignStudent(idProject: number, idStudent: number): Promise<ProjectEntity> {
    const project = await this.findOne(idProject);
    if (!project) {
      throw new HttpException('El proyecto no existe', HttpStatus.NOT_FOUND);
    }
    try {
      await this._studentService.assignToProject({ idStudent: idStudent, idProject: idProject });
      return await this.findOne(idProject);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number): Promise<ProjectEntity> {
    try {
      const project = await this._prismaService.project.findUnique({
        where: {
          id: id,
        },
      });
      if (!project) {
        throw new HttpException(
          'El proyecto no existe',
          HttpStatus.NOT_FOUND,
        );
      }
      return project;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {

    const projectExists = await this.findOne(id);
    if (!projectExists) {
      throw new HttpException('El proyecto no existe', HttpStatus.NOT_FOUND);
    }
    try {
      return await this._prismaService.project.update({
        where: {
          id: id,
        },
        data: updateProjectDto,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number): Promise<HttpException> {
    try {
      const project = this.findOne(id);
      if (!project) {
        throw new HttpException('El proyecto no existe', HttpStatus.NOT_FOUND);
      }
      await this._prismaService.project.update({
        where: {
          id: id,
        },
        data: {
          state: false,
        },
      });
      return new HttpException('Proyecto eliminado', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
