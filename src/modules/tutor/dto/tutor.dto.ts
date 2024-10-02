import { ApiProperty } from "@nestjs/swagger"

export class TutorDto {

  @ApiProperty({ type: 'number', description: 'id del tutor' })
  id: number
  @ApiProperty({ type: 'string', description: 'nombre del tutor' })
  firstName: string
  @ApiProperty({ type: 'string', description: 'apellido del tutor' })
  lastName: string
  
 
}