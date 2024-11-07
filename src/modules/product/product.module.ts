import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadFilesModule } from '../upload-files/upload-files.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule, UploadFilesModule],
})
export class ProductModule {}
