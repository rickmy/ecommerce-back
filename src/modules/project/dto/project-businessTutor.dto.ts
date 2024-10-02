import { ApiProperty } from "@nestjs/swagger";

export class BusinessTutor{
    @ApiProperty({ example: '1', description: 'Id tutor empresarial' })
    id: number;
    @ApiProperty({ example: 'Juan', description: 'Nombre del tutor empresarial' })
    firstName: string;
    @ApiProperty({ example: 'Perez', description: 'Apellido del tutor empresarial' })
    lastName: string;
}