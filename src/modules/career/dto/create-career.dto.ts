import { ApiProperty } from '@nestjs/swagger';
import { UserByCareerDto } from './user-by-career.dto';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCareerDto {
  @ApiProperty({ type: String, description: 'Código de la carrera' })
  @IsString()
  code: string;
  @ApiProperty({ type: String, description: 'Nombre de la carrera' })
  @IsString()
  name: string;
  @ApiProperty({
    type: Date,
    description: 'Fecha de inicio de la fase practica por carrera',
  })
  @IsString()
  dateStart: Date;
  @ApiProperty({
    type: Date,
    description: 'Fecha de fin de la fase practica por carrera',
  })
  @IsString()
  dateEnd: Date;
  @ApiProperty({
    type: Number,
    description:
      'numero de semanas que se demora la renovacion del convenio por carrera',
  })
  @IsNumber()
  timeRenovationAgreement: number;
  @ApiProperty({
    type: Number,
    description: 'Coordinador de la carrera',
  })
  @IsNumber()
  idCoordinator: number;
  @ApiProperty({
    type: Number,
    description: 'Vicecoordinador de la carrera',
  })
  @IsNumber()
  idViceCoordinator: number;
  @ApiProperty({
    type: Number,
    description: 'Responsable de practicas de la carrera',
  })
  @IsNumber()
  idRespStepDual: number;
}
