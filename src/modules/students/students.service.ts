import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, StatusCompany, StatusProject, StatusStudent, TypeDNI } from '@prisma/client';
import { StudentEntity } from './entities/student.entity';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { CareerService } from '../career/career.service';
import { CreateStudentsDto } from './dto/create-students.dto';
import { CreateStudentAssignedToCompanyDto } from './dto/create-student-assigned-to-company.dto';
import { StudentsDto } from './dto/students.dto';
import { StudentExcel } from './models/studentExcel';
import { PaginationResult } from 'src/core/models/paginationResult';
import { StudentDto } from './dto/student.dto';
import { AssignedToProjectDto, AssinedStudentsToProjectDto } from './dto/assigned-to-project.dto';
import { AssignedToCompanyDto, AssinedStudentsToCompanyDto } from './dto/assigned-to-company.dto';
@Injectable()
export class StudentsService {
  private logger = new Logger(StudentsService.name);
  constructor(
    private _prismaService: PrismaService,
    private _userService: UserService,
    private _roleService: RoleService,
    private _careerService: CareerService,
  ) { }

  async uploadStudents(file: Express.Multer.File): Promise<HttpException> {
    let newStudentsExcel: StudentExcel[] = [];
    this.logger.log('Buscando rol estudiante');
    const role = await this._roleService.findByCode('EST');
    const careers = await this._careerService.findAll();
    const listDni = [];
    if (!file) throw new UnprocessableEntityException('No file uploaded');
    const workBook = XLSX.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
    });
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const students = XLSX.utils.sheet_to_json(workSheet);
    let newStudent: StudentExcel = {
      dni: '',
      names: '',
      careerName: '',
      careerCode: '',
      periodAcademic: '',
      parallel: '',
      finalNotes: [],
      statusNotes: [],
    };
    let periodElective = '';
    students.forEach((student, index) => {
      if (!!student['__EMPTY_1']) {
        periodElective = student['__EMPTY_1'].toString();
      }
      if (!!student['__EMPTY_2']) {
        newStudent = {
          dni: student['__EMPTY_2'],
          names: student['__EMPTY_3'],
          careerName: student['__EMPTY_4'],
          careerCode: student['__EMPTY_5'],
          periodAcademic: student['__EMPTY_6'],
          parallel: student['__EMPTY_8'],
          finalNotes: [],
          statusNotes: [],
        };
        newStudent.finalNotes.push(student['__EMPTY_14']);
        newStudent.statusNotes.push(student['__EMPTY_15']);
      }
      if (newStudent.dni !== student['__EMPTY_2']) {
        newStudent.finalNotes.push(student['__EMPTY_14']);
        newStudent.statusNotes.push(student['__EMPTY_15']);
      }

      if (!listDni.includes(newStudent.dni)) {
        listDni.push(newStudent.dni);
        newStudentsExcel.push(newStudent);
      }
    });

    const newUsers: CreateUserDto[] = [];
    const newStundets: CreateStudentsDto[] = [];

    const studentsWithStatus = newStudentsExcel.filter((student) =>
      student.statusNotes.some((status: string) => status === 'APROBADO'),
    );

    studentsWithStatus.forEach((student) => {
      const newUser: CreateUserDto = {
        dni: student.dni,
        userName: student.dni,
        email: '',
        password: this.hashPassword(student.dni),
        idRol: role.id,
      };

      const newStudent: CreateStudentsDto = {
        dni: student.dni,
        firstName: student.names.split(' ')[2],
        secondName: student.names.split(' ')[3],
        lastName: student.names.split(' ')[0],
        secondLastName: student.names.split(' ')[1],
        email: '',
        typeDni: TypeDNI.CEDULA,
        status: student.statusNotes.every(
          (status: string) => status === 'APROBADO'
        ) ? StatusStudent.APROBADO : StatusStudent.REPROBADO,
        idUser: 0,
        idCareer: careers.find(career => career.code.toUpperCase() === student.careerCode.toUpperCase()).id,
      };

      newUser.email = `${newStudent.firstName
        ?.toLowerCase()
        .charAt(0)}${newStudent.secondName
          ?.toLowerCase()
          .charAt(0)}${newStudent.secondLastName
            ?.toLowerCase()
            .charAt(0)}.${newStudent.lastName.toLowerCase()}@yavirac.edu.ec`;
      newUser.userName = newUser.email.split('@')[0];

      newStudent.email = newUser.email;
      newStundets.push(newStudent);
      newUsers.push(newUser);
    });

    const usersDB = await this._userService.findAllByRole(role.id);

    const onlyNewsUser = newUsers.filter(
      (user) => !usersDB.some((userDB) => userDB.dni === user.dni),
    );

    const existingUsers = newUsers.filter((user) =>
      usersDB.some((userDB) => userDB.dni === user.dni && userDB.state === true && userDB.email === user.email),
    );

    if (onlyNewsUser.length > 0) {
      try {

        this.logger.log('Creando usuarios');

        await this._prismaService.user.createMany({
          data: onlyNewsUser,
        });

        this.logger.log('Usuarios creados correctamente');

        this.logger.log('Creando estudiantes');

        const usersDB = await this._prismaService.user.findMany({
          where: {
            dni: { in: onlyNewsUser.map((user) => user.dni) },
          },
        });

        const newStudentsDB = usersDB.map((user) => {
          const student = newStundets.find(
            (student) => student.dni === user.dni
          );
          return {
            ...student,
            idUser: user.id,

          };
        });

        await this._prismaService.student.createMany({
          data: newStudentsDB,
        });

        this.logger.log('Estudiantes creados correctamente');

        this.logger.log('Creando estudiantes asignados a empresa');

        const studentsDB = await this._prismaService.student.findMany({
          where: {
            idUser: { in: usersDB.map((user) => user.id) },
          },
        });

        const studentHasCompany: CreateStudentAssignedToCompanyDto[] = studentsDB.map((student) => {
          return {
            idStudent: student.id,
            idCompany: null,
            electivePeriod: periodElective,
            academicPeriod: newStudentsExcel.find((studentExcel) => studentExcel.dni === student.dni).periodAcademic,
            idProject: null,
            parallel: newStudentsExcel.find((studentExcel) => studentExcel.dni === student.dni).parallel,
          };
        });

        await this._prismaService.studentAssignedToCompany.createMany({
          data: studentHasCompany,
        });

        this.logger.log('Estudiantes asignados a empresa creados correctamente');


      } catch (error) {
        this.logger.error(error);
        throw new HttpException(error.message, error.status);
      }

    }

    const studentsDB = await this._prismaService.student.findMany({
      where: {
        dni: { in: existingUsers.map((user) => user.dni) },
      },
    });


    if (studentsDB.length > 0) {
      studentsDB.forEach(async (studentDB) => {
        const student = newStudentsExcel.find(
          (student) => student.dni === studentDB.dni
        );

        try {
          this.logger.log('Actualizando estudiantes');
          await this._prismaService.student.update({
            where: {
              idUser: studentDB.idUser,
            },
            data: {
              status: student.statusNotes.every(
                (status: string) => status === 'APROBADO'
              ) ? StatusStudent.APROBADO : StatusStudent.REPROBADO,
            },
          });

          this.logger.log('Estudiantes actualizados correctamente');

        } catch (error) {
          this.logger.error(error);
          throw new HttpException(error.message, error.status);
        }

        try {
          await this._prismaService.studentAssignedToCompany.updateMany({
            where: {
              idStudent: studentDB.id,
            },
            data: {
              electivePeriod: periodElective,
              academicPeriod: newStudentsExcel.find((studentExcel) => studentExcel.dni === studentDB.dni).periodAcademic,
              parallel: newStudentsExcel.find((studentExcel) => studentExcel.dni === studentDB.dni).parallel,
              state: student.statusNotes.every(
                (status: string) => status === 'APROBADO'
              ) ? true : false,
            },
          });
        } catch (error) {
          throw new HttpException(error.message, error.status);
        }
      });
    }

    return new HttpException(
      'Estudiantes cargados correctamente',
      HttpStatus.OK,
    );
  }

  async create(createStudentDto: CreateStudentDto): Promise<StudentEntity> {
    const role = await this._roleService.findByCode('EST');
    const career = await this._careerService.findOne(createStudentDto.idCareer);
    const newUser: CreateUserDto = {
      dni: createStudentDto.dni,
      userName: createStudentDto.dni,
      email: createStudentDto.email,
      password: this.hashPassword(createStudentDto.dni),
      idRol: role.id,
    };
    try {
      const user = await this._userService.create(newUser);
      this.logger.log('Usuario creado correctamente');
      const student = await this._prismaService.student.create({
        data: {
          dni: createStudentDto.dni,
          firstName: createStudentDto.firstName,
          secondName: createStudentDto.secondName,
          lastName: createStudentDto.lastName,
          secondLastName: createStudentDto.secondLastName,
          email: createStudentDto.email,
          typeDni: createStudentDto.typeDni,
          status: createStudentDto.status,
          idUser: user.id,
          idCareer: career.id,
        },
      });
      this.logger.log('Estudiante creado correctamente');
      await this._prismaService.studentAssignedToCompany.create({
        data: {
          idStudent: student.id,
          idCompany: null,
          electivePeriod: createStudentDto.electivePeriod,
          academicPeriod: createStudentDto.academicPeriod,
          idProject: null,
          parallel: createStudentDto.parallel,
        },
      });
      this.logger.log('Estudiante asignado a empresa creado correctamente');
      return student;

    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(
    options: PaginationOptions,
    allActive?: boolean,
    idCareer?: number,
  ): Promise<PaginationResult<StudentsDto>> {
    const { page, limit } = options;

    const hasFilter = !!options.name || !!options.identification || !!options.email;

    try {
      const optionsWhere = {
        state: allActive ? true : undefined,
        idCareer: idCareer ? idCareer : undefined,

        OR: options.name ? [
          {
            firstName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            secondName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            secondLastName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        ] : undefined,
        dni: {
          startsWith: options.identification ? options.identification : undefined,
          mode: Prisma.QueryMode.insensitive,
        },
        email: {
          contains: options.email ? options.email : undefined,
          mode: Prisma.QueryMode.insensitive,
        },
      }
      const students = await this._prismaService.student.findMany({
        where: optionsWhere,
        include: {
          career: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });

      this.logger.log('Buscando estudiantes asignados a empresa');
      const studentIds = students.map((student) => student.id);
      const registrations = await this._prismaService.studentAssignedToCompany.findMany({
        where: {
          idStudent: {
            in: studentIds,
          },
        },
      });
      this.logger.log('Estudiantes asignados a empresa encontrados');

      return {
        results: students.map((student) => {
          const registration = registrations.find(
            (registration) => registration.idStudent === student.id,
          );
          return {
            id: student.id,
            dni: student.dni,
            completeNames: `${student.firstName} ${student.secondName} ${student.lastName} ${student.secondLastName}`,
            career: student.career.name,
            parallel: registration.parallel,
            email: student.email,
            periodElective: registration.electivePeriod,
            periodAcademic: registration.academicPeriod,
            status: student.status,
          };
        }),
        limit,
        page,
        total: await this._prismaService.student.count({
          where: optionsWhere,
        }),

      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllStudentsWithNullProject(idCompany: number): Promise<StudentsDto[]> {
    try {
      const studentsWithNullProject = await this._prismaService.studentAssignedToCompany.findMany({
        where: {
          idCompany,
          idProject: null,
        },
        include: {
          student: {
            include: {
              career: true,
            },
          },
          company: true,
        },
      });

      if (!studentsWithNullProject.length) {
        return [];
      }
      return studentsWithNullProject.map((registration) => {
        const student = registration.student;
        return {
          id: student.id,
          dni: student.dni,
          completeNames: `${student.firstName} ${student.secondName} ${student.lastName} ${student.secondLastName}`,
          career: student.career.name,
          parallel: registration.parallel,
          email: student.email,
          periodElective: registration.electivePeriod,
          periodAcademic: registration.academicPeriod,
          status: student.status,
        };
      });
    } catch (error) {

      throw new HttpException('Error al buscar estudiantes sin proyecto asignado', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAllActiveByCompanyId(
    idCompany: number,
    options: PaginationOptions = { page: 0, limit: 500 },
  ): Promise<PaginationResult<StudentsDto>> {
    const { page, limit } = options;

    const hasFilter = !!options.name || !!options.identification || !!options.email;
    const companyExists = await this._prismaService.company.findFirst({
      where: {
        id: idCompany,
      },
    });

    if (!companyExists) {
      throw new HttpException('La empresa con el ID proporcionado no existe', HttpStatus.NOT_FOUND);
    }

    const optionsWhere = {
      idCompany: idCompany,
      state: true,
      student: {
        OR: options.name ? [
          {
            firstName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            secondName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            secondLastName: {
              contains: options.name ? options.name.toUpperCase() : undefined,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        ] : undefined,
        dni: {
          startsWith: options.identification ? options.identification : undefined,
          mode: Prisma.QueryMode.insensitive,
        },
        email: {
          contains: options.email ? options.email : undefined,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    }

    try {
      const studentsAssignedToCompany = await this._prismaService.studentAssignedToCompany.findMany({
        where: optionsWhere,
        include: {
          student: {
            include: {
              career: true,
            }
          },
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });

      if (!studentsAssignedToCompany.length) {
        return {
          results: [],
          limit: options.limit,
          page: options.page,
          total: 0,
        };
      }
      return {
        results: studentsAssignedToCompany.map((studentAssignedToCompany) => {
          return {
            id: studentAssignedToCompany.student.id,
            dni: studentAssignedToCompany.student.dni,
            completeNames: `${studentAssignedToCompany.student.firstName} ${studentAssignedToCompany.student.secondName} ${studentAssignedToCompany.student.lastName} ${studentAssignedToCompany.student.secondLastName}`,
            career: studentAssignedToCompany.student.career.name,
            parallel: studentAssignedToCompany.parallel,
            email: studentAssignedToCompany.student.email,
            periodElective: studentAssignedToCompany.electivePeriod,
            periodAcademic: studentAssignedToCompany.academicPeriod,
            status: studentAssignedToCompany.student.status,
          }
        }),
        total: await this._prismaService.studentAssignedToCompany.count({
          where: optionsWhere,
        }),
        page,
        limit
      }


    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error al buscar estudiantes activos por compañía', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async assignStudentsToProject(
    assinedStudentsToProjectDto: AssinedStudentsToProjectDto
  ) {
    try {
      this.logger.log('Buscando matriculas de los estudiantes');
      const companyExists = await this._prismaService.company.findFirst({
        where: {
          project: {
            some: {
              id: assinedStudentsToProjectDto.idProject,
            },
          },
        },
      });

      if (!companyExists)
        throw new HttpException('La empresa no existe', HttpStatus.NOT_FOUND);

      const companyWithAgreement = await this._prismaService.company.findUnique({
        where: {
          id: companyExists.id,
        },
        include: {
          agreement: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      const agreement = companyWithAgreement?.agreement[0];

      if (!agreement || agreement.status !== StatusProject.ACTIVO) {

        throw new HttpException('La empresa no puede recibir estudiantes hasta que su convenio esté aprobado', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      const registrationUpdate = await this._prismaService.studentAssignedToCompany.updateMany({
        where: {
          idStudent: {
            in: assinedStudentsToProjectDto.idStudents,
          },
        },
        data: {
          idProject: assinedStudentsToProjectDto.idProject,
        },
      });
      if (!registrationUpdate)
        throw new HttpException('No se pudo actualizar los estudiantes', HttpStatus.NOT_FOUND);
      return new HttpException(
        'Estudiantes asignados correctamente al proyecto',
        HttpStatus.OK,
      );

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAllStudentsPendingToAssign(idCareer: number): Promise<StudentsDto[]> {
    try {
      await this._careerService.findOne(idCareer);
      const students = await this._prismaService.student.findMany({
        where: {
          state: true,
          status: StatusStudent.APROBADO,
          studentAssignedToCompany: {
            every: {
              idCompany: null,
            },
          },
          idCareer,
        },
        include: {
          career: true,
          studentAssignedToCompany: true
        }
      })

      const registrations = await this._prismaService.studentAssignedToCompany.findMany({
        where: {
          idStudent: {
            in: students.map((student) => student.id),
          },
        },
      });

      return students.map((student) => {
        const registration = registrations.find(
          (registration) => registration.idStudent === student.id,
        );
        return {
          id: student.id,
          dni: student.dni,
          completeNames: `${student.firstName} ${student.secondName} ${student.lastName} ${student.secondLastName}`,
          career: student.career.name,
          parallel: registration.parallel,
          email: student.email,
          periodElective: registration.electivePeriod,
          periodAcademic: registration.academicPeriod,
          status: student.status,
        }
      })
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }




  async findOne(id: number): Promise<StudentDto> {
    try {
      const student = await this._prismaService.student.findFirst({
        where: {
          id,
        },
        include: {
          career: true,
        }
      });

      if (!student) {
        throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
      }
      const registration = await this._prismaService.studentAssignedToCompany.findFirst({
        where: {
          idStudent: student.id,
        },
        include: {
          company: true,
          project: {
            include: {
              academicTutor: true,
              businessTutor: true,
            }
          },
        }
      });

      return {
        id: student.id,
        dni: student.dni,
        firstName: student.firstName,
        secondName: student.secondName,
        lastName: student.lastName,
        secondLastName: student.secondLastName,
        idCareer: student.idCareer,
        career: student.career.name,
        parallel: registration.parallel,
        email: student.email,
        electivePeriod: registration.electivePeriod,
        academicPeriod: registration.academicPeriod,
        idCompany: registration?.company?.id || null,
        company: registration?.company?.name || null,
        project: registration?.project?.name || null,
        academicTutor: !!registration?.project?.academicTutor ? `${registration?.project?.academicTutor?.firstName} ${registration?.project?.academicTutor?.lastName}` : null,
        businessTutor: !!registration?.project?.academicTutor ? `${registration?.project?.academicTutor?.firstName} ${registration?.project?.academicTutor?.lastName}` : null,
        status: student.status,
      };

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findStudentByDni(dni: string) {
    try {
      return await this._prismaService.student.findFirst({
        where: {
          dni: dni,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<HttpException> {

    try {
      const studentExists = await this.findOne(id);
      if (!studentExists) {
        throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
      }
      await this._prismaService.student.update({
        where: {
          id,
        },
        data: {
          firstName: updateStudentDto.firstName,
          secondName: updateStudentDto.secondName,
          lastName: updateStudentDto.lastName,
          secondLastName: updateStudentDto.secondLastName,
          idCareer: updateStudentDto.idCareer,
        },
      });
      await this._prismaService.studentAssignedToCompany.update({
        where: {
          id,
        },
        data: {
          parallel: updateStudentDto.parallel,
          electivePeriod: updateStudentDto.electivePeriod,
          academicPeriod: updateStudentDto.academicPeriod,
        },
      });

      return new HttpException('Estudiante actualizado correctamente', HttpStatus.OK)
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async assignToCompany(
    updateStudentDto: AssignedToCompanyDto,
  ): Promise<HttpException> {
    const studentExists = await this.findOne(updateStudentDto.idStudent);
    if (!studentExists) {
      throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
    }

    const companyWithAgreement = await this._prismaService.company.findFirst({
      where: {
        id: updateStudentDto.idCompany,
      },
      include: {
        agreement: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      }
    });

    const agreement = companyWithAgreement.agreement[0];
    if (!agreement || agreement.status !== StatusProject.ACTIVO) {
      throw new HttpException('La empresa no tiene un convenio activo', HttpStatus.NOT_FOUND);
    }


    const registrationExists = await this._prismaService.studentAssignedToCompany.findFirst({
      where: {
        idStudent: updateStudentDto.idStudent,
      },
    });
    try {
      await this._prismaService.studentAssignedToCompany.update({
        where: {
          id: registrationExists.id,
        },
        data: {
          idCompany: updateStudentDto.idCompany,
        },
      });

      await this._prismaService.student.update({
        where: {
          id: updateStudentDto.idStudent,
        },
        data: {
          status: StatusStudent.ASIGNADO,
        },
      });
      return new HttpException(
        'Estudiante asignado a empresa o proyecto actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  async assignStudentsToCompany(
    assinedStudentsToCompanyDto: AssinedStudentsToCompanyDto
  ) {
    try {
      this.logger.log('Buscando matriculas de los estudiantes');

      const companyWithAgreement = await this._prismaService.company.findUnique({
        where: {
          id: assinedStudentsToCompanyDto.idCompany,
        },
        include: {
          agreement: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      const agreement = companyWithAgreement?.agreement[0];

      if (!agreement || agreement.status !== StatusProject.ACTIVO) {

        throw new HttpException('La empresa no puede recibir estudiantes hasta que su convenio esté aprobado', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      const registrationUpdate = await this._prismaService.studentAssignedToCompany.updateMany({
        where: {
          idStudent: {
            in: assinedStudentsToCompanyDto.idStudents,
          },
        },
        data: {
          idCompany: assinedStudentsToCompanyDto.idCompany,
        },
      });
      if (!registrationUpdate)
        throw new HttpException('No se pudo actualizar los estudiantes', HttpStatus.NOT_FOUND);

      await this._prismaService.student.updateMany({
        where: {
          id: {
            in: assinedStudentsToCompanyDto.idStudents,
          },
        },
        data: {
          status: StatusStudent.ASIGNADO,
        },
      });
      return new HttpException(
        'Estudiantes asignados correctamente',
        HttpStatus.OK,
      );

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async assignToProject(
    updateStudentDto: AssignedToProjectDto,
  ): Promise<HttpException> {
    const studentExists = await this.findOne(updateStudentDto.idStudent);
    if (!studentExists) {
      throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
    }
    const registrationExists = await this._prismaService.studentAssignedToCompany.findFirst({
      where: {
        idStudent: updateStudentDto.idStudent,
      },
    });
    if (!registrationExists) {
      throw new HttpException('La matriculación del estudiante no existe', HttpStatus.NOT_FOUND);
    }
    try {
      await this._prismaService.studentAssignedToCompany.update({
        where: {
          id: registrationExists.id,
        },
        data: {
          idProject: updateStudentDto.idProject,

        },
      });
      return new HttpException(
        'Estudiante asignado a proyecto actualizado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async unassignToProject(id: number): Promise<HttpException> {
    const studentExists = await this.findOne(id);
    if (!studentExists) {
      throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
    }
    const registrationExists = await this._prismaService.studentAssignedToCompany.findFirst({
      where: {
        idStudent: id,
      },
    });
    try {
      await this._prismaService.studentAssignedToCompany.update({
        where: {
          id: registrationExists.id,
        },
        data: {
          idProject: null,
        },
      });
      return new HttpException(
        'Estudiante eliminado del proyecto correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async unassignToCompany(id: number): Promise<HttpException> {
    const studentExists = await this.findOne(id);
    if (!studentExists) {
      throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
    }
    const registrationExists = await this._prismaService.studentAssignedToCompany.findFirst({
      where: {
        idStudent: id,
      },
    });
    try {
      await this._prismaService.studentAssignedToCompany.update({
        where: {
          id: registrationExists.id,
        },
        data: {
          idCompany: null,
          idProject: null,
        },
      });

      await this._prismaService.student.update({
        where: {
          id: id,
        },
        data: {
          status: StatusStudent.APROBADO,
        },
      });
      
      return new HttpException(
        'Estudiante eliminado de la empresa correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateStatusStudent(
    id: number,
    status: StatusStudent,
  ): Promise<StudentEntity> {
    const studentExists = await this.findOne(id);
    if (!studentExists) {
      throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
    }
    try {
      return await this._prismaService.student.update({
        where: {
          id
        },
        data: {
          status: status,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: number): Promise<HttpException> {
    try {

      const student = await this._prismaService.student.findFirst({
        where: {
          id
        },
      });
      if (!student) {
        throw new HttpException('El estudiante no existe', HttpStatus.NOT_FOUND);
      }
      await this._prismaService.student.update({
        where: {
          id,
        },
        data: {
          state: false,
        },
      });
      await this._userService.remove(student.idUser);
      return new HttpException(
        'Estudiante eliminado correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
