import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/filters/exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { LoggerModule } from 'nestjs-pino';
import {
  CorrelationIdMiddleware,
  correlationId,
} from './core/middleware/correlation-id/correlation-id.middleware';
import { Request } from 'express';
import { UploadFilesModule } from './modules/upload-files/upload-files.module';
import { UnauthorizedExceptionFilter } from './core/filters/UnauthorizedException.filter';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { SettingModule } from './modules/setting/setting.module';

@Module({
  imports: [
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
    ProductModule,
    CategoryModule,
    OrderModule,
    SettingModule,
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
