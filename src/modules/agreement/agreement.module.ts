import { Module } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { UploadFilesModule } from '../upload-files/upload-files.module';

@Module({
  controllers: [AgreementController],
  providers: [AgreementService],
  imports: [PrismaModule, MailModule, UploadFilesModule]
})
export class AgreementModule {}
