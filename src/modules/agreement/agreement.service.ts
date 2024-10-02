import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AgreementEntity } from './entities/agreement.entity';
import { MailService } from '../mail/mail.service';
const cron = require('node-cron');
import { AgreementDto } from './dto/agreement.dto';
import { UploadFilesService } from '../upload-files/upload-files.service';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';
import { Prisma, StatusProject } from '@prisma/client';

@Injectable()
export class AgreementService {
  private logger = new Logger(AgreementService.name);
  constructor(
    private _prismaService: PrismaService,
    private _mailService: MailService,
    private _uploadService: UploadFilesService,

  ) {
    this.listCareersWithAgreements();
  }
  async create(createAgreementDto: CreateAgreementDto) {
    try {
      const existingAgreement = await this._prismaService.agreement.findUnique({
        where: {
          code: createAgreementDto.code,
        },
      });

      if (existingAgreement) {
        throw new HttpException(
          'Ya existe un convenio con este código',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const agreementsByCode = await this._prismaService.agreement.findMany({
        where: {
          idCompany: createAgreementDto.idCompany,
        },
      });

      if (!!agreementsByCode || agreementsByCode.length > 0) {
        try {
          await this._prismaService.agreement.updateMany({
            where: {
              id: {
                in: agreementsByCode.map((agreement) => agreement.id),
              }
            },
            data: {
              status: StatusProject.INACTIVO,
            },
          });
        } catch (error) {
          throw new HttpException(error.message, error.status);
        }
      }

      const agreement = await this._prismaService.agreement.create({
        data: {
          code: createAgreementDto.code,
          dateStart: createAgreementDto.dateStart,
          dateEnd: createAgreementDto.dateEnd,
          itvPath: createAgreementDto.itvPath,
          agreementPath: createAgreementDto.agreementPath,
          status: createAgreementDto.status,
          idCompany: createAgreementDto.idCompany,
          state: true,
        },
      });
      if (!agreement)
        throw new HttpException(
          'Error al crear el convenio',
          HttpStatus.BAD_REQUEST,
        );

      return agreement;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(
    idCareer: number,
    options: PaginationOptions,
    allActive?: boolean,
  ): Promise<PaginationResult<AgreementDto>> {

    const { page, limit } = options;

    const hasFilter = !!options.code || !!options.company || !!options.dateStart || !!options.dateEnd;


    try {
      this.logger.log('Empezando a buscar convenios')
      const agreements = await this._prismaService.agreement.findMany({
        where: {
          state: allActive ? true : undefined,

          code: options.code ? {
            contains: options.code,
            mode: Prisma.QueryMode.insensitive,
          } : undefined,


          dateStart: options.dateStart ? {
            gte: options.dateStart,
          } : undefined,

          dateEnd: options.dateEnd ? {
            lte: options.dateEnd,
          } : undefined,

          company: {
            idCareer: idCareer,
            name: options.company ? {
              contains: options.company,
              mode: Prisma.QueryMode.insensitive,
            } : undefined,
          },
        },
        include: {
          company: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: hasFilter ? undefined : limit,
        skip: hasFilter ? undefined : page,
      });
      this.logger.log('Terminando de buscar convenios')
      if (!agreements || agreements.length === 0)
        return {
          results: [],
          limit: limit,
          page: page,
          total: 0,
        };
      this.logger.log('Empezando a mapear convenios')
      return {
        results: agreements.map((agreement) => {
          return {
            id: agreement.id,
            code: agreement.code,
            dateStart: agreement.dateStart,
            dateEnd: agreement.dateEnd,
            company: agreement.company.name,
            status: agreement.status
          }
        }),
        limit: limit,
        page: page,
        total: await this._prismaService.agreement.count({
          where: {
            state: allActive ? true : undefined
          },
        }),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: number): Promise<AgreementEntity> {

    const agreement = await this._prismaService.agreement.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
      }
    });
    if (!agreement)
      throw new HttpException(
        `Convenio con el id: ${id}, no existe`,
        HttpStatus.NOT_FOUND,
      );
    return agreement;

  }

  async notificateAgreement(id: number) {
    try {
      const agreement = await this.findOne(id);
      const { idCompany } = agreement;
      const company = await this._prismaService.company.findUnique({
        where: {
          id: idCompany,
        },
        include: {
          career: {
            include: {
              coordinator: true,
              viceCoordinator: true,
              respStepDual: true,
            }
          },
        },
      });
      const { career } = company;
      const { coordinator, viceCoordinator, respStepDual } = career;

      const coordinatorEmail = coordinator.email;
      const viceCoordinatorEmail = viceCoordinator.email;
      const responsibleEmail = respStepDual.email;

      this.logger.log(coordinatorEmail, viceCoordinatorEmail, responsibleEmail)
      const send = await this._mailService.sendMailAgreementExpired(coordinatorEmail, viceCoordinatorEmail, responsibleEmail, agreement.code, company.name);
      if (!send)
        throw new HttpException(
          'Error al enviar el correo',
          HttpStatus.BAD_REQUEST,
        );
      return new HttpException('Correo enviado correctamente', HttpStatus.OK);

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: number, updateAgreementDto: UpdateAgreementDto) {
    try {
      const agreementDB = await this.findOne(id);
      if (agreementDB.itvPath !== updateAgreementDto.itvPath) {
        await this._uploadService.removeFile({ name: agreementDB.itvPath });
      }
      if (agreementDB.agreementPath !== updateAgreementDto.agreementPath) {
        await this._uploadService.removeFile({ name: agreementDB.agreementPath });
      }
      const agreement = await this._prismaService.agreement.update({
        where: {
          id: id,
        },
        data: {
          ...updateAgreementDto
        },
      });
      if (!agreement)
        throw new HttpException(
          'Error al actualizar el convenio',
          HttpStatus.BAD_REQUEST,
        );

      return agreement;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async listCareersWithAgreements() {
    const job = cron.schedule('0 0 20 * * 1', async () => {
      try {
        const careers = await this._prismaService.career.findMany();
        const agreementsCodes: string[] = [];
        if (!careers || careers.length === 0)
          throw new HttpException('No se encontraron carreras', HttpStatus.NOT_FOUND);

        for (const career of careers) {
          const { id, idCoordinator, idViceCoordinator, idRespStepDual } = career;

          const coordinator = await this._prismaService.user.findUnique({
            where: { id: idCoordinator },
          });
          const viceCoordinator = await this._prismaService.user.findUnique({
            where: { id: idViceCoordinator },
          });
          const responsible = await this._prismaService.user.findUnique({
            where: { id: idRespStepDual },
          });

          const coordinatorEmail = coordinator.email;
          const viceCoordinatorEmail = viceCoordinator.email;
          const responsibleEmail = responsible.email;

          const companies = await this._prismaService.company.findMany({
            where: {
              idCareer: id,
              state: true,
            },
            include: {
              agreement: {
                where: {
                  state: true,
                },
              },
            },
          });

          for (const company of companies) {
            const { agreement } = company;
            agreement.forEach((agreement) => {
              const { dateEnd } = agreement;
              const currentDate = new Date();
              if (this.getNumberWeeks(currentDate, dateEnd) <= career.timeRenovationAgreement && this.getNumberWeeks(currentDate, dateEnd) > 0) {
                agreementsCodes.push(agreement.code);
              }
            }
            );
          }

          if (agreementsCodes.length > 0) {
            await this._mailService.sendMailAgreementRenovation(coordinatorEmail, viceCoordinatorEmail, responsibleEmail, agreementsCodes);
          }
        }
      } catch (error) {
        throw new HttpException(error.message, error.status);
      }
    });
    job.start();
  }

  getNumberWeeks(dateStart: Date, dateEnd: Date): number {
    const diffTime = Math.abs(dateEnd.getTime() - dateStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    return weeks;
  }

  async remove(id: number): Promise<HttpException> {
    try {
      const agreement = this.findOne(id);
      if (!agreement) {
        throw new HttpException('El convenio no existe', HttpStatus.NOT_FOUND);
      }
      await this._prismaService.agreement.update({
        where: {
          id: id,
        },
        data: {
          state: false,
        },
      });

      return new HttpException('Convenio eliminado', HttpStatus.OK);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
