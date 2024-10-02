import { ApiProperty } from "@nestjs/swagger";
import { Career, Company, StatusCompany } from "@prisma/client";
import { CareerEntity } from "src/modules/career/entities/career.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

export class CompanyEntity implements Company {
    
    @ApiProperty({ example: 1, description: 'Company id' })
    id: number;
    @ApiProperty({ example: '2354235357', description: 'Ruc empresa' })
    ruc: string;
    @ApiProperty({ example: 'Yavirac EC', description: 'Nombre empresa' })
    name: string;
    @ApiProperty({ example: '2354235357', description: 'Dni representante legal' })
    dniRepresentLegal: string;
    @ApiProperty({ example: 'Alberto', description: 'Nombre representante legal' })
    nameRepresentLegal: string;
    @ApiProperty({ example: 'Ríos', description: 'Apellido representante legal' })
    lastNameRepresentLegal: string;
    @ApiProperty({ example: '0983656375', description: 'Número telefónico empresa' })
    phone: string;
    @ApiProperty({ example: 'Av. Mariscal Sucre y Venezuela E435', description: 'Dirección empresa' })
    address: string;
    @ApiProperty({ example: 'yav.ec@gmail.com', description: 'Correo electronico empresa' })
    email: string;
    createdAt: Date;
    updatedAt: Date;
    state: boolean;
    @ApiProperty({ example: 'PENDIENTE', description: 'Status Empresa' })
    status: StatusCompany;
    @ApiProperty({ example: 1, description: 'ID carrera' })
    idCareer: number;
    career?: CareerEntity;
    @ApiProperty({ example: 1, description: 'ID Usuario' })
    idUser: number;
    user?: UserEntity;

    
}
