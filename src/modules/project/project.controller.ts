import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { ProjectDto } from './dto/project.dto';
import { PaginationResult } from 'src/core/models/paginationResult';
import { ProjectInfoDto } from './dto/project-info.dto';
import { AssignAcademicTutorDto } from './dto/project-asign-academic-tutor.dto';
import { AssignBusinessTutorDto } from './dto/project-assign-business-tutor.dto';
import { AssignStudentDto } from './dto/project-assign-student..dto';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';

@ApiBearerAuth()
@Controller('project')
@ApiTags('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiCreatedResponse({ description: 'Proyecto creado', type: CreateProjectDto })
  @ApiOperation({ summary: 'Crear proyecto' })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @ApiOkResponse({
    description: 'Proyectos encontrados',
    type: ProjectEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los proyectos' })
  @Post(':idCompany')
  findAll(@Param('idCompany', ParseIntPipe) idCompany: number,@Body() options: PaginationOptions) {
    return this.projectService.findAll(idCompany, options );
  }

  @Post('active/:idCompany')
  @ApiOkResponse({
    description: 'Proyectos activos encontrados',
    type: PaginationOptions,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los proyectos activos' })
  findAllActive(@Param('idCompany', ParseIntPipe) idCompany: number,@Body() options: PaginationOptions) {
    return this.projectService.findAll(idCompany, options, true);
  }

  @Post('active/career/:idCareer')
  @ApiOkResponse({
    description: 'Proyectos activos encontrados',
    type: PaginationOptions,
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los proyectos activos por carrera' })
  findAllActiveByCareer(@Param('idCareer', ParseIntPipe) idCareer: number,@Body() options: PaginationOptions) {
    return this.projectService.findAllByCareer(idCareer, options, true);
  }

  @Put('assign-academic-tutor')
  @ApiOperation({ summary: 'Asignar tutor academico a un proyecto' })
  @ApiBody({ type: AssignAcademicTutorDto })
  assignAcademicTutor(@Body () assignAcademicTutorDto: AssignAcademicTutorDto) {
    
    return this.projectService.assignAcademicTutor(
      assignAcademicTutorDto.projectId,
      assignAcademicTutorDto.academicTutorId,
    );
  }

  @ApiOkResponse({
    description: 'Información del proyecto encontrada',
    type: ProjectInfoDto,
  })
  @ApiOperation({ summary: 'Encontrar información del proyecto por su ID' })
  @Get(':id')
  findProjectInfoById(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findProjectInfoById(id);
  }
  @Put('/assign-business-tutor')
  @ApiOperation({ summary: 'Asignar tutor empresarial a un proyecto' })
  assignBusinessTutor(@Body () assignBusinessTutorDto: AssignBusinessTutorDto) {
    return this.projectService.assignBusinessTutor(
      assignBusinessTutorDto.projectId,
      assignBusinessTutorDto.businessTutorId,
    );
  }
  
  @Put('/assign-student')
  @ApiOperation({ summary: 'Asignar estudiante a un proyecto' })
  assignStudent(@Body () assignStudentDto: AssignStudentDto) {
    return this.projectService.assignStudent(
      assignStudentDto.projectId, 
      assignStudentDto.studentId);
  }

  @ApiOkResponse({
    description: 'Proyecto Actualizado',
   
  })
  @ApiOperation({ summary: 'Actualizar un proyecto por su ID' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @ApiResponse({ status: 200, description: 'Elimina un proyecto por su ID' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiOperation({ summary: 'Eliminar proyecto por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
