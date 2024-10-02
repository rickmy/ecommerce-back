import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateStudentAssignedToCompanyDto {
  @IsNumber()
  @ApiProperty({ description: 'id empresa', example: '1' })
  idCompany: number | null
  @IsNumber()
  @ApiProperty({ description: 'id estudiante', example: '1' })
  idStudent: number
  @IsNumber()
  @ApiProperty({ description: 'id empresa', example: '1' })
  idProject: number | null
  @IsString()
  @ApiProperty({ description: 'Periodo electivo', example: '2022-2023' })
  electivePeriod: string
  @IsString()
  @ApiProperty({ description: 'Periodo academico', example: '2022-2' })
  academicPeriod: string
  @IsString()
  @ApiProperty({ description: 'Paralelo estudiante', example: '' })
  parallel: string
}