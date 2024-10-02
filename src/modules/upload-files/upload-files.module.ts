import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';

@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
  exports: [UploadFilesService],
})
export class UploadFilesModule {}
