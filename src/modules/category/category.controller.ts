import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Crear categoría' })
  @ApiOkResponse({ description: 'Categoría Creada', type: CategoryEntity })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Listar categorías' })
  @ApiOkResponse({ description: 'Lista de categorías', type: [CategoryEntity] })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Buscar categoría por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Categoría encontrada', type: CategoryEntity })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Categoría actualizada', type: CategoryEntity })
  @ApiBody({ type: UpdateCategoryDto })
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
