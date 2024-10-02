import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgreementEntity } from './entities/agreement.entity';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';

@ApiBearerAuth()
@Controller('agreement')
@ApiTags('agreement')
@UseGuards(JwtAuthGuard)
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) { }

  @ApiCreatedResponse({ description: 'Estudiante creado', type: AgreementEntity })
  @ApiOperation({ summary: 'Crear convenios' })
  @Post()
  create(@Body() createAgreementDto: CreateAgreementDto) {
    return this.agreementService.create(createAgreementDto);
  }

  @ApiOperation({ summary: 'Listar carreras con convenios' })
  @Get('listCareersWithAgreements')
  async listCareersWithAgreements(): Promise<any> {
    const data = await this.agreementService.listCareersWithAgreements();
    return data;
  }

  @Get('notificate/:id')
  @ApiOperation({ summary: 'Notificar convenio' })
  @ApiOkResponse({ description: 'Correo enviado correctamente', type: HttpException })
  async notificate(@Param('id', ParseIntPipe) id: string) {
    return await this.agreementService.notificateAgreement(+id);
  }

  @ApiOkResponse({
    description: 'Convenios encontrados',
    type: AgreementEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los convenios' })
  @Post(':idCareer')
  findAll(@Param('idCareer', ParseIntPipe ) idCareer: string, @Body() options: PaginationOptions) {
    return this.agreementService.findAll(+idCareer, options);
  }

  @ApiOkResponse({
    description: 'Convenios encontrados',
    type: AgreementEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los convenios activos' })
  @Post('active/:idCareer')
  findAllActive(@Param('idCareer', ParseIntPipe) idCareer: string, @Body() options: PaginationOptions) {
    return this.agreementService.findAll(+idCareer, options, true);
  }

  @ApiOkResponse({ description: 'Convenio encontrado', type: AgreementEntity })
  @ApiOperation({ summary: 'Encontrar un convenio por su ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.agreementService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Convenio Actualizado',
    type: CreateAgreementDto,
  })
  @ApiOperation({ summary: 'Actualizar un convenio por su ID' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateAgreementDto: UpdateAgreementDto) {
    return this.agreementService.update(+id, updateAgreementDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Elimina un convenio por su ID' })
  @ApiResponse({ status: 404, description: 'Convenio no encontrado' })
  @ApiOperation({ summary: 'Eliminar convenio por su ID' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.agreementService.remove(+id);
  }
}
