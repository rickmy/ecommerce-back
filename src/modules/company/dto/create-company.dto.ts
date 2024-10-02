import { ApiProperty } from "@nestjs/swagger";
import { Project, StatusCompany } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCompanyDto {

    @IsString({ message: 'el ruc debe ser un string' })
    @IsNotEmpty({ message: 'el ruc no debe estar vacio' })
    @ApiProperty({ description: 'ruc compañia', example: '23336434254' })
    ruc: string;
    @IsString({ message: 'el nombre debe ser un string' })
    @IsNotEmpty({ message: 'el nombre no debe estar vacio' })
    @ApiProperty({ description: 'nombre compañia', example: 'Yavirac EC' })
    name: string;
    @IsString({ message: 'el dni del representante legal ser un string' })
    @IsNotEmpty({ message: 'el dni del representante legal no debe estar vacio' })
    @ApiProperty({ description: 'dni representante legal', example: '1724345645' })
    dniRepresentLegal: string;
    @IsString({ message: 'el nombre del representante legal ser un string' })
    @IsNotEmpty({ message: 'el nombre del representante legal no debe estar vacio' })
    @ApiProperty({ description: 'nombre representante legal', example: 'Alberto' })
    nameRepresentLegal: string;
    @IsString({ message: 'el apellido del representante legal ser un string' })
    @IsNotEmpty({ message: 'el apellido del representante legal no debe estar vacio' })
    @ApiProperty({ description: 'apellido representante legal', example: 'Ríos' })
    lastNameRepresentLegal: string;
    @IsString({ message: 'el email de la empresa debe ser un string' })
    @IsNotEmpty({ message: 'el email de la empresa no debe estar vacio' })
    @ApiProperty({ description: 'email empresa', example: 'yavi.ec@gmail.com' })
    email: string;
    @IsString({ message: 'el número de la empresa ser un string' })
    @IsNotEmpty({ message: 'el número la empresa no debe estar vacio' })
    @ApiProperty({ description: 'número empresa', example: '0983458761' })
    phone: string;
    @IsString({ message: 'la dirección de la empresa debe ser un string' })
    @IsNotEmpty({ message: 'la dirección de la empresa no debe estar vacio' })
    @ApiProperty({ description: 'direccion empresa', example: 'Av. Mariscal Sucre y Venezuela E234' })
    address: string;
    @IsEnum(StatusCompany, { message: 'El estado de la empresa es inválido' })
    @ApiProperty({
    description: 'Estado de la empresa',
    enum: StatusCompany,
    default: StatusCompany.ACTIVO,
    })
    status: StatusCompany;
    @IsNumber()
    @ApiProperty({ description: 'id carrera', example: 1 })
    idCareer: number;

}
