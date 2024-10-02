import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService],
  imports: [PrismaModule, UserModule, RoleModule],
})
export class TutorModule {}
