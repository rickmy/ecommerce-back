import { ApiProperty } from "@nestjs/swagger";
import { StatusCompany } from "@prisma/client";
import { IsEnum } from "class-validator";

export class CompaniesDto {
    @ApiProperty({ example: '453564356487', description: 'Ruc empresa' })
    ruc: string;
    @ApiProperty({ example: 'Yavirac EC', description: 'Nombre de la empresa' })
    name: string;
    @ApiProperty({ example: '1727373644', description: 'dni del representante legal' })
    dniRepresentLegal: string;
    @ApiProperty({ example: 'Alberto Gómez', description: 'nombre completo del representante legal' })
    representLegalCompleteNames: string;
    @ApiProperty({ example: 'yec@yavirac.edu.ec', description: 'Correo de la empresa' })
    email: string;
    @ApiProperty({ example: '0986535641', description: 'número de la empresa' })
    phone: string;
    @ApiProperty({ example: 'Av. Eloy Alfaro y Venezuela S18', description: 'dirección de la empresa' })
    address: string;
    @IsEnum(StatusCompany, { message: 'El status de la empresa es inválido' })
    @ApiProperty({
      description: 'Status convenio',
      enum: StatusCompany,
      default: StatusCompany.ACTIVO,
    })
    status: StatusCompany;

}