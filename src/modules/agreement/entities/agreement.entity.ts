import { ApiProperty } from "@nestjs/swagger";
import { Agreement, StatusProject } from "@prisma/client";

export class AgreementEntity implements Agreement {
    @ApiProperty({ example: 1, description: 'ID del convenio' })
    id: number;
    @ApiProperty({ example: '45BCD', description: 'Código convenio' })
    code: string;
    @ApiProperty({ example: new Date(), description: 'Fecha inicio convenio' })
    dateStart: Date;
    @ApiProperty({ example: new Date(), description: 'Fecha fin convenio' })
    dateEnd: Date;
    @ApiProperty({ example: 'docs/WhatsApp_Image_2023-06-27_at_10.46.22-removebg-preview.png', description: 'Url del itv' })
    itvPath: string;
    @ApiProperty({ example: 'docs/WhatsApp_Image_2023-06-27_at_10.46.22-removebg-preview.png', description: 'Url del convenio' })
    agreementPath: string;
    @ApiProperty({ example: new Date(), description: 'Fecha de creación' })
    createdAt: Date;
    @ApiProperty({ example: new Date(), description: 'Fecha de actualización' })
    updatedAt: Date;
    @ApiProperty({ example: true, description: 'Eliminado' })
    state: boolean;
    @ApiProperty({ example: StatusProject.ACTIVO, description: 'Estado del convenio'})
    status: StatusProject;
    @ApiProperty({ example: 1, description: 'ID de la empresa' })
    idCompany: number;
}
