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
  Put,
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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';
import { UserDto } from './dto/user.dto';
import { UpdateUserResponseDto } from './dto/update-user-response-dto';
import { PaginationOptions } from 'src/core/models/paginationOptions';
import { PaginationResult } from 'src/core/models/paginationResult';
import { CreateClientDto } from './dto/create-user-client.dto';
import { ClientDto } from './dto/client.dto';

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

  @ApiOkResponse({ description: 'Cliente Creado', type: CreateUserDto })
  @ApiOperation({ summary: 'Crear cliente' })
  @Post('client')
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.userService.createClient(createClientDto);
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
  findAllClients(@Body() options: PaginationOptions) {
    return this.userService.findAllClients(options, true);
  }

  @Get('client/:id')
  @ApiOkResponse({
    description: 'Cliente encontrado',
    type: ClientDto,
  })
  @UseGuards(JwtAuthGuard)
  findOneClient(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOneClient(+id);
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

  @Put('client/:id')
  @ApiOkResponse({
    description: 'Cliente Actualizado',
    type: ClientDto,
  })
  @ApiOperation({ summary: 'Actualizar un cliente por su ID' })
  @ApiBody({
    type: CreateClientDto,
  })
  @ApiParam({ name: 'id', type: 'number' })
  @UseGuards(JwtAuthGuard)
  updateClient(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateClientDto: CreateClientDto,
  ) {
    return this.userService.updateClient(+id, updateClientDto);
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
