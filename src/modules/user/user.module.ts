import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleModule } from '../role/role.module';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, RoleModule, MailModule],
  exports: [UserService],
})
export class UserModule {}
