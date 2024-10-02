import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger/dist';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';
import { PaginationResult } from 'src/core/models/paginationResult';
import { PaginationOptions } from 'src/core/models/paginationOptions';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @ApiOkResponse({ description: 'Rol creado', type: CreateRoleDto })
  @ApiOperation({ summary: 'Crear rol' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('all')
  @ApiOkResponse({
    type: PaginationResult<RoleEntity>,
    description: 'Roles encontrado',
  })
  @ApiOperation({ summary: 'Encontrar todos los roles' })
  findAll(@Body() options: PaginationOptions) {
    return this.roleService.findAll(options);
  }
  @Post('active')
  @ApiOkResponse({
    type: PaginationResult<RoleEntity>,
    description: 'Roles activos encontrados',
  })
  @ApiOperation({ summary: 'Encontrar todos los roles activos' })
  findAllActive(@Body() options: PaginationOptions) {
    return this.roleService.findAll(options, true);
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreateRoleDto,
    description: 'Rol encontrado',
  })
  @ApiOperation({ summary: 'Encontrar un rol por su ID' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.roleService.findRoleWithPermissions(+id);
  }

  @Put(':id')
  @ApiOkResponse({ type: CreateRoleDto, description: 'Rol actualizado' })
  @ApiOperation({ summary: 'Actualizar un rol por su ID' })
  update(@Param('id', ParseIntPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateRoleDto, description: 'Rol eliminado' })
  @ApiOperation({ summary: 'Eliminar un rol por su ID' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.roleService.remove(+id);
  }
}
