import { Module } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerController } from './career.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { TutorModule } from '../tutor/tutor.module';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
  imports: [PrismaModule, UserModule, RoleModule, TutorModule],
})
export class CareerModule {}
