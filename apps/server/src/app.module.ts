import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { baseEnvSchema } from './envSchema';
import { PrismaService } from './common/services/prisma/prisma.service';
import { MonnifyService } from './common/services/monnify/monnify.service';
import { MonoService } from './common/services/mono/mono.service';
import { HttpClientModule } from '@nestjs/http-client';
import { CacheModule } from '@nestjs/cache-manager';
import { UserAuthModule } from './modules/user-auth/user-auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env-local', '.env.local', '.env'],
      validationSchema: baseEnvSchema,
    }),
    HttpClientModule.register({
      interceptors: [],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UserAuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    AppService,
    PrismaService,
    MonnifyService,
    MonoService,
  ],
})
export class AppModule {}
