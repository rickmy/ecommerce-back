import { ApiProperty } from '@nestjs/swagger';
import { TypeDNI, User } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class UserEntity implements User {
  @ApiProperty({ example: 1, description: 'Identificador', type: 'number' })
  @IsNumber()
  id: number;
  @ApiProperty({ example: '12345678', description: 'DNI', type: 'string' })
  dni: string;
  @ApiProperty({
    example: 'CEDULA',
    description: 'Tipo de DNI',
    enum: TypeDNI,
    type: 'string',
  })
  typeDni: TypeDNI;
  @ApiProperty({
    example: 'hector.ruiz',
    description: 'Nombre de usuario',
    type: 'string',
  })
  userName: string;
  @ApiProperty({ example: 'Hector', description: 'Student first name' })
  firstName: string;
  @ApiProperty({
    example: 'Hugo',
    description: 'Student second name',
    readOnly: true,
  })
  secondName: string;
  @ApiProperty({
    example: 'Ruiz',
    description: 'Student last name',
    readOnly: true,
  })
  lastName: string;
  @ApiProperty({
    example: 'Sánchez',
    description: 'Student secont last name',
    readOnly: true,
  })
  secondLastName: string;
  email: string;
  @ApiProperty({ example: '', description: 'Contraseña', type: 'string' })
  password: string;
  @ApiProperty({
    example: '2021-10-10T00:00:00.000Z',
    description: 'Fecha de creación',
    type: 'string',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-10-10T00:00:00.000Z',
    description: 'Fecha de actualización',
    type: 'string',
  })
  updatedAt: Date;
  @ApiProperty({ example: true, description: 'Estado', type: 'boolean' })
  state: boolean;
  @ApiProperty({ example: 1, description: 'Rol', type: 'number' })
  idRol: number;
}
