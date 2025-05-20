import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { ResetPasswordService } from './reset-password.service';
import { AccessTokenStartegy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ResetPasswordService,
    AccessTokenStartegy,
    RefreshTokenStrategy,
  ],
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.registerAsync({
      async useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('ACCESS_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [ResetPasswordService],
})
export class AuthModule {}
