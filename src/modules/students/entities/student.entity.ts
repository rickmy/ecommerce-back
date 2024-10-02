import { ApiProperty } from '@nestjs/swagger';
import { StatusStudent, Student, TypeDNI } from '@prisma/client';
import { CareerEntity } from 'src/modules/career/entities/career.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class StudentEntity implements Student {
  @ApiProperty({ example: 1, description: 'Student id' })
  id: number

  typeDni: TypeDNI
  @ApiProperty({ example: '1234233423', description: 'Cédula del estudiante' })
  dni: string
  @ApiProperty({ example: 'Juan', description: 'Primer nombre del estudiante' })
  firstName: string
  @ApiProperty({ example: 'Alberto', description: 'Segundo nombre del estudiante' })
  secondName: string | null
  @ApiProperty({ example: 'Vallejo', description: 'Primer apellido del estudiante' })
  lastName: string
  @ApiProperty({ example: 'Vaca', description: 'Segundo apellido del estudiante' })
  secondLastName: string | null
  @ApiProperty({ example: 'jav.vallejo@yavirac.edu.ec', description: 'Email del estudiante' })
  email: string
  @ApiProperty({ example: 1, description: 'Id del usuario' })
  idUser: number
  createdAt: Date
  updatedAt: Date
  state: boolean
  status: StatusStudent
  idCareer: number
}
