import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsString } from "class-validator"

export class CreateBussinesTutorDto {
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
  @ApiProperty({ type: 'number', description: 'id de la carrera' })
  @IsNumber({allowNaN: false, allowInfinity: false}, { message: 'El id de la empresa debe ser de tipo number' })
  idCompany: number
}
