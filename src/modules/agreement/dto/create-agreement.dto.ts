import { ApiProperty } from "@nestjs/swagger";
import { StatusProject } from "@prisma/client";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";

export class CreateAgreementDto {
  @IsString()
  @ApiProperty({ example: '45BCD', description: 'Código convenio' })
  code: string;
  @IsString()
  @ApiProperty({ example: new Date(), description: 'Fecha inicio convenio' })
  dateStart: Date;
  @IsString()
  @ApiProperty({ example: new Date(), description: 'Fecha fin convenio' })
  dateEnd: Date;
  @IsString()
  @ApiProperty({ example: 'docs/WhatsApp_Image_2023-06-27_at_10.46.22-removebg-preview.png', description: 'Url del itv' })
  itvPath: string;
  @IsString()
  @ApiProperty({ example: 'docs/WhatsApp_Image_2023-06-27_at_10.46.22-removebg-preview.png', description: 'Url del convenio' })
  agreementPath: string;
  @IsEnum(StatusProject, { message: 'El status del convenio es inválido' })
  @ApiProperty({
    description: 'Status convenio',
    enum: StatusProject,
    default: StatusProject.ACTIVO,
  })
  status: StatusProject;
  @IsNumber()
  @ApiProperty({ example: 1, description: 'ID de la empresa' })
  idCompany: number;
}
