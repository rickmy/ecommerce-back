import { ApiProperty } from "@nestjs/swagger";
import { Tutor } from "@prisma/client";

export class TutorEntity implements Tutor {
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
  @ApiProperty({ type: 'boolean', description: 'si es tutor academico?' })
  isAcademic: boolean
  @ApiProperty({ type: 'number', description: 'id del usuario' })
  idUser: number
  @ApiProperty({ type: 'number', description: 'id de la carrera' })
  idCareer: number
  @ApiProperty({ type: 'number', description: 'id de la empresa' })
  idCompany: number
  @ApiProperty({ type: 'date', description: 'fecha de creacion' })
  createdAt: Date
  @ApiProperty({ type: 'date', description: 'fecha de actualizacion' })
  updatedAt: Date
  @ApiProperty({ type: 'boolean', description: 'estado del tutor' })
  state: boolean
}
