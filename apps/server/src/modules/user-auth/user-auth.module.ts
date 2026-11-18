import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { EmailService } from '../../common/services/email/email.service';
import { SentService } from '../../common/services/sent/sent.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { HttpClient } from '@nestjs/http-client';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,
    PrismaService,
    EmailService,
    SentService,
    AuthGuard,
    HttpClient,
  ],
  exports: [UserAuthService, JwtModule, AuthGuard],
})
export class UserAuthModule {}
