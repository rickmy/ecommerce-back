import { Controller, UseInterceptors, UploadedFile, Post, Body, HttpException, Res, UseGuards } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {  FileNameDto} from './dto/file.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/auth/auth.guard';


class Path {
  path: string;
}
@ApiBearerAuth()
@ApiTags('upload-files')
@Controller('upload-files')
@UseGuards(JwtAuthGuard)
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) { }
  @Post()
  @ApiOperation({ summary: 'Subir archivos pdf' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      properties: {
        archivo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Archivo subido',
    type: Path,
  })
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFilesService.uploadFile(file);
  }


  @Post('remove')
  @ApiOperation({ summary: 'Eliminar archivos pdf' })
  @ApiOkResponse({type: HttpException})
  remove(@Body() name:FileNameDto) {
    return this.uploadFilesService.removeFile(name);
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
