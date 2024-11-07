import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { CloudinaryProvider } from './provider/cloudinary.provider';

@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService, CloudinaryProvider],
  exports: [UploadFilesService],
})
export class UploadFilesModule {}
