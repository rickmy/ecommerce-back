import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportCompanyDto } from './dto/report-company.dto';
import { Prisma } from '@prisma/client';
import { ReportByTutorDto } from './dto/report-by-tutor.dto';
import { StudentProjectDto } from '../students/dto/student-project.dto';
import { TutorDto } from '../tutor/dto/tutor.dto';
import { first } from 'rxjs';

@Injectable()
export class ReportService {

  private logger = new Logger(ReportService.name);

  constructor(private _prismaService: PrismaService) { }

  async reportByAcademicTutor(idAcademicTutor: number): Promise<ReportByTutorDto[]> {
    this.logger.log(`Report by academic tutor id: ${idAcademicTutor}`);

    try {
      const registration = await this._prismaService.studentAssignedToCompany.findMany({
        where: {
          project: {
            academicTutor: {
              id: idAcademicTutor,
            },
            state: true,
          }
        },
        include: {
          student: true,
          company: true,
          project: {
            include: {
              academicTutor: true,
              businessTutor: true,
            }
          },
        },
      });

      if (!registration || registration.length === 0) {
        throw new HttpException('No se encontraron registros para este tutor', HttpStatus.NOT_FOUND);
      }

      const studentByCompany = registration.map((registration) => {
        const student = {
          completeNames: `${registration.student.firstName} ${registration.student.secondName} ${registration.student.lastName} ${registration.student.secondLastName}`,
          periodElective: registration.electivePeriod,
          periodAcademic: registration.academicPeriod,
          project: registration.project.name,
        };
        return {
          company: registration.company.name,
          academicTutor: !!registration.project.academicTutor ? `${registration.project.academicTutor.firstName} ${registration.project.academicTutor.lastName}` : null,
          businessTutor: !!registration.project.academicTutor ? `${registration.project.businessTutor.firstName} ${registration.project.businessTutor.lastName}` : null,
          student,
        };
      });

      if (!studentByCompany || studentByCompany.length === 0) {
        throw new HttpException('No se encontraron registros para este tutor', HttpStatus.NOT_FOUND);
      }
  
      const reportByTutor = studentByCompany.reduce((acc, curr) => {
        const found = acc.find((item) => item.company === curr.company);
        if (found) {
          found.student.push(curr.student);
        } else {
          acc.push({
            company: curr.company,
            academicTutor: curr.academicTutor,
            businessTutor: curr.businessTutor,
            student: [curr.student],
          });
        }
        return acc;
      }, []);

      if (!reportByTutor || reportByTutor.length === 0) {
        throw new HttpException('No se encontraron registros para este tutor', HttpStatus.NOT_FOUND);
      }
  
      return reportByTutor;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException(error.message, error.status);
    }

  }

  async reportByCompany(idCompany: number): Promise<ReportCompanyDto> {
    try {

      const companyName = await this._prismaService.company.findFirst({
        where: {
          id: idCompany,
        },
        
      });

      if (!companyName) {
        throw new HttpException('La empresa no existe', HttpStatus.NOT_FOUND);
      }

      const registration = await this._prismaService.studentAssignedToCompany.findMany({
        where: {
          idCompany: companyName.id,
          state: true,
        },
        include: {
          student: true,
          company: true,
          project: {
            include: {
              academicTutor: true,
              businessTutor: true,
            },
          },
        },
      });

      if (!registration) {
        throw new HttpException('No existen proyectos y/o estudiantes asignados a esta empresa', HttpStatus.NOT_FOUND);
      }

  
      const students: StudentProjectDto[] = registration.map(registration => ({
        completeNames: `${registration.student.firstName} ${registration.student.secondName ?? ''} ${registration.student.lastName} ${registration.student.secondLastName ?? ''}`,
        periodElective: registration.electivePeriod,
        periodAcademic: registration.academicPeriod,
        project: registration.project?.name ?? null,
      }));
  
      const academicTutor = !!registration[0].project?.academicTutor ? `${registration[0].project?.academicTutor?.firstName} ${registration[0].project?.academicTutor?.lastName}` : null;
      const businessTutor = !!registration[0].project?.businessTutor ? `${registration[0].project?.businessTutor?.firstName} ${registration[0].project?.businessTutor?.lastName}`: null;
  
      const reportCompanyDto: ReportCompanyDto = {
        company: registration[0].company.name,
        academicTutor,
        businessTutor,
        students,
      };
      
      return reportCompanyDto;
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
