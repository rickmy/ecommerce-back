import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/core/config';
import { PassportModule } from '@nestjs/passport';
import { JWTstrategy } from './strategy/jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTstrategy],
  exports: [PassportModule, JWTstrategy, AuthService],
})
export class AuthModule {}
