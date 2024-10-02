import { ApiProperty } from "@nestjs/swagger";

export class ProjectCompany {
    @ApiProperty({ example: '1', description: 'Id empresa' })
    id: number;
    @ApiProperty({ example: 'Yavi Soft', description: 'Nombre de la empresa' })
    name: string;
    @ApiProperty({ example: '1726345645', description: 'Ruc de la empresa' })
    ruc: string;
}