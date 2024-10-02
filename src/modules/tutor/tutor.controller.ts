import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { CreateAcademicTutorDto } from './dto/create-tutor-academic.dto';
import { CreateBussinesTutorDto } from './dto/create-tutor-bussiness.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TutorEntity } from './entities/tutor.entity';
import { TutorDto } from './dto/tutor.dto';
import { TutorAcademicDto } from './dto/tutor-academic.dto';
import { TutorBussinesDto } from './dto/tutor-bussines.dto';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';

@ApiBearerAuth()
@ApiTags('Tutor')
@Controller('tutor')
@UseGuards(JwtAuthGuard)
export class TutorController {
  constructor(private readonly tutorService: TutorService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un tutor Generico' })
  @ApiOkResponse({ description: 'Tutor creado correctamente', type: TutorEntity })
  @ApiBody({ type: CreateTutorDto })
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorService.create(createTutorDto);
  }

  @Post('academic')
  @ApiOperation({ summary: 'Crear un tutor Academico' })
  @ApiOkResponse({ description: 'Tutor creado correctamente', type: TutorEntity })
  @ApiBody({ type: CreateAcademicTutorDto })
  createAcademic(@Body() createTutorDto: CreateAcademicTutorDto) {
    return this.tutorService.createTutorAcademic(createTutorDto);
  }

  @Post('business')
  @ApiOperation({ summary: 'Crear un tutor Empresarial' })
  @ApiOkResponse({ description: 'Tutor creado correctamente', type: TutorEntity })
  @ApiBody({ type: CreateBussinesTutorDto })
  createBusiness(@Body() createTutorDto: CreateBussinesTutorDto) {
    return this.tutorService.createTutorBusiness(createTutorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tutores' })
  @ApiOkResponse({ description: 'Tutores encontrados correctamente', type: [TutorDto] })
  findAll() {
    return this.tutorService.findAll();
  }

  @Post('academic/:idCareer')
  @ApiOperation({ summary: 'Obtener todos los tutores Academicos' })
  @ApiParam({ name: 'idCareer', required: true, type: Number })
  @ApiOkResponse({ description: 'Tutores Academicos encontrados correctamente', type: [TutorAcademicDto] })
  findAllAcademic(@Param('idCareer', ParseIntPipe) idCareer: string, @Body() options: PaginationOptions) {
    return this.tutorService.findAllAcademic(+idCareer, options);
  }

  @Post('academic/active/:idCareer')
  @ApiOperation({ summary: 'Obtener todos los tutores Academicos activos' })
  @ApiParam({ name: 'idCareer', required: true, type: Number })
  @ApiOkResponse({ description: 'Tutores Academicos activos encontrados correctamente', type: [TutorAcademicDto] })
  findAllAcademicActive(@Param('idCareer', ParseIntPipe) idCareer: string, @Body() options: PaginationOptions) {
    return this.tutorService.findAllAcademic(+idCareer, options, true);
  }

  @Post('business/:idCompany')
  @ApiOperation({ summary: 'Obtener todos los tutores Empresariales' })
  @ApiParam({ name: 'idCompany', required: true, type: Number })
  @ApiOkResponse({ description: 'Tutores Empresariales encontrados correctamente', type: [TutorBussinesDto] })
  findAllBusiness(@Param('idCompany', ParseIntPipe) idCompany: string, @Body() options: PaginationOptions) {
    return this.tutorService.findAllBusiness(+idCompany, options);
  }

  @Post('business/active/:idCompany')
  @ApiOperation({ summary: 'Obtener todos los tutores Empresariales activos' })
  @ApiParam({ name: 'idCompany', required: true, type: Number })
  @ApiOkResponse({ description: 'Tutores Empresariales activos encontrados correctamente', type: [TutorBussinesDto] })
  findAllBusinessActive(@Param('idCompany', ParseIntPipe) idCompany: string, @Body() options: PaginationOptions) {
    return this.tutorService.findAllBusiness(+idCompany, options, true);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOperation({ summary: 'Obtener un tutor por su id' })
  @ApiOkResponse({ description: 'Tutor encontrado correctamente', type: TutorEntity })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.tutorService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tutor' })
  @ApiBody({ type: UpdateTutorDto })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({ description: 'Tutor actualizado correctamente', type: TutorEntity })
  update(@Param('id', ParseIntPipe) id: string, @Body() updateTutorDto: UpdateTutorDto) {
    return this.tutorService.update(+id, updateTutorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tutor' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({ description: 'Tutor eliminado correctamente', type: HttpException })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.tutorService.remove(+id);
  }
}
