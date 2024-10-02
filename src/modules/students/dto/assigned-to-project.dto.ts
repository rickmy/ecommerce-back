import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class AssignedToProjectDto {
  @IsNumber()
  @ApiProperty({ description: 'id estudiante', example: '1' })
  idStudent: number
  @IsNumber()
  @ApiProperty({ description: 'id empresa', example: '1' })
  idProject: number;
}

export class AssinedStudentsToProjectDto {
  @IsNumber()
  @ApiProperty({ description: 'id empresa', example: '1' })
  idProject: number;
  @IsNumber({}, {each: true, message: 'El campo idStudents debe ser un array de numeros'})
  @ApiProperty({ description: 'id estudiantes', example: '[1,2,3]' })
  idStudents: number[];
}