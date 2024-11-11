import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';
import { UserDto } from './dto/user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response-dto';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'Usuario Creado', type: CreateUserDto })
  @ApiOperation({ summary: 'Crear usuario' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('all')
  @ApiOkResponse({
    description: 'Usuarios encontrados',
    type: PaginationResult<UserDto>,
  })
  @ApiOperation({ summary: 'Encontrar todos los usuarios' })
  @UseGuards(JwtAuthGuard)
  findAll(@Body() options: PaginationOptions) {
    return this.userService.findAll(options);
  }

  @Post('active')
  @ApiOkResponse({
    description: 'Usuarios encontrados',
    type: PaginationResult<UserDto>,
  })
  @ApiOperation({ summary: 'Encontrar todos los usuarios activos' })
  @UseGuards(JwtAuthGuard)
  findAllActive(@Body() options: PaginationOptions) {
    return this.userService.findAll(options, true);
  }

  @Post('clients')
  @ApiOkResponse({
    description: 'Usuarios encontrados',
    type: PaginationResult<UserDto>,
  })
  @ApiOperation({ summary: 'Encontrar todos los clientes' })
  @UseGuards(JwtAuthGuard)
  findAllClients() {
    return this.userService.findAllClients();
  }

  @Get('byRole/:id')
  @ApiOkResponse({
    type: UserDto,
    description: 'Usuarios encontrados',
    isArray: true,
  })
  @ApiOperation({ summary: 'Encontrar todos los usuarios por rol' })
  @UseGuards(JwtAuthGuard)
  findAllByRole(@Param('id') id: string) {
    return this.userService.findAllByRole(+id);
  }

  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: UserEntity,
  })
  @ApiNoContentResponse({
    description: 'Usuario no encontrado',
    type: null,
  })
  @ApiOperation({ summary: 'Encontrar usuario por su ID' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Usuario Actualizado',
    type: UpdateUserResponseDto,
  })
  @ApiOperation({ summary: 'Actualizar un usuario por su ID' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      properties: {
        userName: { type: 'string' },
      },
      required: ['userName'],
    },
  })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body('userName') userName: string,
  ): UpdateUserResponseDto {
    const updateUserDto: UpdateUserDto = { name: userName };
    this.userService.update(+id, updateUserDto);
    return { message: 'Usuario Actualizado' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Elimina un usuario por su DNI' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiOperation({ summary: 'Eliminar usuario por su ID' })
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
