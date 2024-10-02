import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator"

export class CreateTutorDto {
  @ApiProperty({ type: 'string', description: 'dni del tutor' })
  @IsString({ message: 'El dni debe ser de tipo string' })
  dni: string
  @ApiProperty({ type: 'string', description: 'nombre del tutor' })
  @IsString({ message: 'El nombre debe ser de tipo string' })
  firstName: string
  @ApiProperty({ type: 'string', description: 'apellido del tutor' })
  @IsString({ message: 'El apellido debe ser de tipo string' })
  lastName: string
  @ApiProperty({ type: 'string', description: 'email del tutor' })
  @IsEmail({}, { message: 'El email debe ser de tipo email' })
  email: string
  @ApiProperty({ type: 'boolean', description: 'si es tutor academico?' })
  @IsBoolean({ message: 'El campo isAcademic debe ser de tipo boolean' })
  isAcademic: boolean
  @ApiProperty({ type: 'number', description: 'id de la carrera' })
  @IsOptional()
  idCareer: number
  @ApiProperty({ type: 'number', description: 'id de la empresa' })
  @IsOptional()
  idCompany: number
}