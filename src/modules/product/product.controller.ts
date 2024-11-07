import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { DetailProductDto } from './dto/detail-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiOkResponse({ description: 'Product created', type: ProductDto })
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ description: 'Products list', type: [ProductDto] })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({ description: 'Product by id', type: DetailProductDto })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiOkResponse({ description: 'Product updated', type: ProductDto })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProductDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Set images' })
  @ApiOkResponse({ description: 'Images set', type: ProductDto })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'indexMain', type: String })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  @Put('images/:id/:indexMain')
  setImages(
    @Param('id') id: string,
    @Param('indexMain') indexMain: string,
    @UploadedFiles() files: { images: Express.Multer.File[] },
  ) {
    return this.productService.setImages(+id, +indexMain, files.images);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ description: 'Product deleted', type: String })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
