import { ApiProperty } from "@nestjs/swagger"

export class TutorAcademicDto {
  @ApiProperty({ type: 'number', description: 'id del tutor' })
  id: number
  @ApiProperty({ type: 'string', description: 'dni del tutor' })
  dni: string
  @ApiProperty({ type: 'string', description: 'nombre del tutor' })
  firstName: string
  @ApiProperty({ type: 'string', description: 'apellido del tutor' })
  lastName: string
  @ApiProperty({ type: 'string', description: 'email del tutor' })
  email: string
  @ApiProperty({ type: 'number', description: 'id de la carrera' })
  idCareer: number
  @ApiProperty({ type: 'string', description: 'carrera del tutor' })
  career: string
}