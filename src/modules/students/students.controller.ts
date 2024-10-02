import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { StudentEntity } from './entities/student.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStudentDto } from './dto/update-student.dto';

import { StudentsDto } from './dto/students.dto';
import { PaginationResult } from 'src/core/models/paginationResult';
import { StudentDto } from './dto/student.dto';
import { AssignedToProjectDto, AssinedStudentsToProjectDto } from './dto/assigned-to-project.dto';
import { AssignedToCompanyDto, AssinedStudentsToCompanyDto } from './dto/assigned-to-company.dto';
import { PaginationOptions } from 'src/core/models/paginationOptions';


@ApiBearerAuth()
@Controller('students')
@ApiTags('student')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @ApiCreatedResponse({ description: 'Estudiante creado', type: CreateStudentDto })
  @ApiOperation({ summary: 'Crear estudiante' })
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'Estudiantes subidos'
  })
  @ApiBody({ required: true, type: FileInterceptor })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir excel de los estudiantes' })
  @Post('upload')
  uploadStudents(@UploadedFile() file: Express.Multer.File) {
    return this.studentsService.uploadStudents(file);
  }

  @ApiOkResponse({
    description: 'Status del estudiante actualizado',
    type: CreateStudentDto,
  })
  @ApiOperation({ summary: 'Actualizar el status de un estudiante por su ID' })
  @Put('status/:id')
  updateStatusStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStatusStudent(
      +id,
      updateStudentDto.status,
    );
  }

  @ApiOperation({ summary: 'Encontrar todos los estudiantes' })
  @ApiOkResponse({
    description: 'Estudiantes encontrados',
    type: PaginationResult<StudentsDto>,
  })
  @Post('all')
  findAll(@Body() options: PaginationOptions) {
    return this.studentsService.findAll(options);
  }

  @Post('active/:idCareer')
  @ApiOkResponse({
    description: 'Estudiantes encontrados',
    type: PaginationResult<StudentsDto>,
  })
  @ApiParam({ name: 'idCareer', required: true, type: Number })
  @ApiOperation({ summary: 'Encontrar todos los estudiantes activos por carrera' })
  findAllActive(@Param('idCareer') idCareer: string, @Body() options: PaginationOptions) {
    return this.studentsService.findAll(options, true, +idCareer);
  }

  @Post('byCompany/:idCompany')
  @ApiOkResponse({
    description: 'Estudiantes encontrados',
    type: PaginationResult<StudentsDto>,
  })
  @ApiParam({ name: 'idCompany', required: true, type: Number })
  @ApiOperation({ summary: 'Encontrar todos los estudiantes activos por empresa' })
  findAllActiveByCompany(
    @Param('idCompany') idCompany: string,
    @Body() options: PaginationOptions
  ): Promise<PaginationResult<StudentsDto>> {
    return this.studentsService.findAllActiveByCompanyId(+idCompany, options);
  }

  @Get('toAssign/:idCareer')
  @ApiOkResponse({
    description: 'Estudiantes encontrados',
    type: StudentsDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los estudiantes a asignar' })
  findAllToAssign(@Param('idCareer', ParseIntPipe) idCareer: string) {
    return this.studentsService.findAllStudentsPendingToAssign(+idCareer);
  }

  @Get('withNullProject/:idCompany')
  @ApiOkResponse({
    description: 'Estudiantes encontrados sin proyecto asignado',
    type: StudentsDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los estudiantes sin proyecto asignado por compañía' })
  @ApiParam({ name: 'idCompany', required: true, type: Number })
  async findAllStudentsWithNullProject(@Param('idCompany', ParseIntPipe) idCompany: string) {
    return this.studentsService.findAllStudentsWithNullProject(+idCompany);
  }

  @ApiOkResponse({ description: 'Estudiante encontrado', type: StudentDto })
  @ApiOperation({ summary: 'Encontrar un estudiante por su Id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.studentsService.findOne(+id);
  }

  @Put('assign-to-project')
  @ApiOkResponse({
    description: 'Estudiante asignado a proyecto',
    type: CreateStudentDto,
  })
  @ApiOperation({ summary: 'Asignar un estudiante a un proyecto' })
  @ApiBody({ type: AssignedToProjectDto })
  assignToProject(@Body() body: AssignedToProjectDto) {
    return this.studentsService.assignToProject(body);
  }

  @Put('unassign-to-project/:id')
  @ApiOkResponse({
    description: 'Estudiante desasignado a proyecto',
    type: CreateStudentDto,
  })
  @ApiOperation({ summary: 'Desasignar un estudiante a un proyecto' })
  @ApiParam({ name: 'id', required: true, type: Number })
  unassignToProject(@Param('id', ParseIntPipe) id: string) {
    return this.studentsService.unassignToProject(+id);
  }

  @Put('assign-to-company')
  @ApiOkResponse({
    description: 'Estudiante asignado a empresa',
    type: CreateStudentDto,
  })
  @ApiOperation({ summary: 'Asignar un estudiante a una empresa' })
  @ApiBody({ type: AssignedToCompanyDto })
  assignToCompany(@Body() body: AssignedToCompanyDto) {
    return this.studentsService.assignToCompany(body);
  }

  @Put('assign-students-to-company')
  @ApiOkResponse({
    description: 'Estudiantes para asignar a la empresa',
    type: HttpException,
  })
  @ApiOperation({ summary: 'Asignar estudiantes a una empresa' })
  @ApiBody({ type: AssinedStudentsToCompanyDto })
  assignStudentsToCompany(@Body() assinedStudentsToCompanyDto: AssinedStudentsToCompanyDto) {
    return this.studentsService.assignStudentsToCompany(assinedStudentsToCompanyDto);
  }

  @Put('assign-students-to-project')
  @ApiOkResponse({
    description: 'Estudiantes para asignar a un proyecto',
    type: HttpException,
  })
  @ApiOperation({ summary: 'Asignar estudiantes a un proyecto' })
  @ApiBody({ type: AssinedStudentsToProjectDto })
  assignStudentsToProject(@Body() assinedStudentsToProjectDto: AssinedStudentsToProjectDto) {
    return this.studentsService.assignStudentsToProject(assinedStudentsToProjectDto);
  }

  @Put('unassign-to-company/:id')
  @ApiOkResponse({
    description: 'Estudiante desasignado a empresa',
    type: CreateStudentDto,
  })
  @ApiOperation({ summary: 'Desasignar un estudiante a una empresa' })
  @ApiParam({ name: 'id', required: true, type: Number })
  unassignToCompany(@Param('id', ParseIntPipe) id: string) {
    return this.studentsService.unassignToCompany(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estudiante por su ID' })
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,) {

    
    return await this.studentsService.update(id, updateStudentDto);
      
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Elimina un estudiante por su DNI' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  @ApiOperation({ summary: 'Eliminar estudiante por su ID' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.studentsService.remove(+id);
  }


}
