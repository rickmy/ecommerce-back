import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [PrismaModule, UserModule, RoleModule],
})
export class CompanyModule {}
