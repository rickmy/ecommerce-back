import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class UserEntity implements User {
  @ApiProperty({ example: 1, description: 'Identificador', type: 'number' })
  @IsNumber()
  id: number;
  @ApiProperty({ example: '12345678', description: 'DNI', type: 'string' })
  dni: string;
  @ApiProperty({ example: 'Hector', description: ' user name' })
  name: string;
  @ApiProperty({
    example: 'Ruiz',
    description: 'Student last name',
    readOnly: true,
  })
  lastName: string;
  @ApiProperty({
    example: 'example@example.com',
    description: 'email user',
    readOnly: true,
  })
  email: string;
  @ApiProperty({ example: '', description: 'Contraseña', type: 'string' })
  password: string;
  @ApiProperty({ example: 1, description: 'Rol', type: 'number' })
  roleId: number;
  @ApiProperty({
    example: '123456789',
    description: 'phone user',
    type: 'string',
  })
  phone: string;
  @ApiProperty({
    example: 'company',
    description: 'company name ',
    type: 'string',
  })
  company: string;
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
  status: boolean;
}
