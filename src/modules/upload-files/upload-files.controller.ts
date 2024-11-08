import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
  HttpException,
  Res,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileNameDto } from './dto/file.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';
import { UploadApiResponseCloudinary } from './dto/upload-api-response';
@ApiBearerAuth()
@ApiTags('upload-files')
@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}
  @Post()
  @ApiOperation({ summary: 'Subir imagenes' })
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFilesService.uploadImageToCloudinary(file);
  }

  @ApiOperation({ summary: 'Upload multiples images' })
  @ApiOkResponse({
    description: 'Images uploaded',
    type: [UploadApiResponseCloudinary],
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  @Post('multi')
  UploadImages(@UploadedFiles() files: { images: Express.Multer.File[] }) {
    return this.uploadFilesService.uploadImages(files.images);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar archivos pdf' })
  @ApiBody({ type: [String] })
  @ApiOkResponse({ type: HttpException })
  remove(@Body() publicsId: string[]) {
    return this.uploadFilesService.removeImage(publicsId);
  }

  @Post('download')
  @ApiOperation({ summary: 'Descargar archivos pdf' })
  @ApiOkResponse({
    description: 'Archivo descargado',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async download(@Body() name: FileNameDto, @Res() res: Response) {
    return this.uploadFilesService.downloadFile(name, res);
  }
}
