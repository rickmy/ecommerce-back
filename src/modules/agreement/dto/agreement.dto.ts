import { ApiProperty } from "@nestjs/swagger";
import { StatusProject } from "@prisma/client";

export class AgreementDto {
  @ApiProperty({ example: 1, description: 'ID del convenio' })
  id: number;
  @ApiProperty({ example: '45BCD', description: 'Código convenio' })
  code: string;
  @ApiProperty({ example: new Date(), description: 'Fecha inicio convenio' })
  dateStart: Date;
  @ApiProperty({ example: new Date(), description: 'Fecha fin convenio' })
  dateEnd: Date;
  @ApiProperty({ example: StatusProject.ACTIVO, description: 'Estado del convenio'})
  status: StatusProject;
  @ApiProperty({ example: "Yavirac", description: 'nombre de la empresa' })
  company: string;
}