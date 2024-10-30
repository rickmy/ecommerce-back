import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/filters/exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import config from './core/config';
import { LoggerModule } from 'nestjs-pino';
import {
  CorrelationIdMiddleware,
  correlationId,
} from './core/middleware/correlation-id/correlation-id.middleware';
import { Request } from 'express';
import { UploadFilesModule } from './modules/upload-files/upload-files.module';
import { UnauthorizedExceptionFilter } from './core/filters/UnauthorizedException.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            levelFirst: true,
          },
        },
        customProps: (req: Request) => {
          return { correlationId: req[correlationId] };
        },
        autoLogging: false,
        serializers: {
          req: (req: Request) => ({
            method: req.method,
            url: req.url,
            body: req.body,
          }),
          res: (res: Response) => ({
            statusCode: res.status,
            body: res.body,
          }),
        },
      },
    }),
    UploadFilesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
