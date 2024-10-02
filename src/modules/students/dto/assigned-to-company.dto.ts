import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNumber, IsString } from "class-validator"

export class AssignedToCompanyDto {
  @IsNumber()
  @ApiProperty({ description: 'id empresa', example: '1' })
  idCompany: number
  @IsNumber()
  @ApiProperty({ description: 'id estudiante', example: '1' })
  idStudent: number
}

export class AssinedStudentsToCompanyDto {
  @IsNumber()
  @ApiProperty({ description: 'id empresa', example: '1' })
  idCompany: number;
  @IsNumber({}, {each: true, message: 'El campo idStudents debe ser un array de numeros'})
  @ApiProperty({ description: 'id estudiantes', example: '[1,2,3]' })
  idStudents: number[];
}