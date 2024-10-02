import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { CareerModule } from '../career/career.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
  imports: [PrismaModule, UserModule, RoleModule, CareerModule],
})
export class StudentsModule {}
