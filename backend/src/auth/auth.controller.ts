import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Ip,
  NotAcceptableException,
  Post,
  Req,
  ServiceUnavailableException,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { MailService } from '../mail/mail.service';
import { PrismaClientExceptionFilter } from '../prisma-client-exception/prisma-client-exception.filter';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ResetPasswordService } from './reset-password.service';

@Controller('auth')
@UseFilters(PrismaClientExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
    private codeService: ResetPasswordService,
    private prisma: PrismaService,
  ) {}

  @Post('/validate-code')
  @HttpCode(200)
  validateResetCode(@Body() dto: { code: string }) {
    if (!this.codeService.validateCode(dto.code)) {
      throw new NotAcceptableException('Invalid code');
    }
    return 'ok';
  }

  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      const { code } = await this.codeService.generateCode(dto.email);
      try {
        await this.mailService.sendMail({
          to: dto.email,
          subject: 'Reset password',
          html: `You can reset your password using this code : <b>${code}</b>`,
        });
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
      return 'Check your mailbox';
    }

    throw new BadRequestException(`Invalid email`);
  }

  @Post('/signup')
  signup(@Body() user: SignupUserDto) {
    return this.authService.signup(user);
  }

  @Post('/signin')
  async signin(
    @Req() req: Request,
    @Body() dto: SigninUserDto,
    @Ip() ip: string,
  ) {
    const user = await this.authService.signin(dto.email, dto.password);

    const userAgent = req.headers['user-agent']!;
    const refreshToken = await this.authService.generateRefreshToken(
      dto.email,
      ip,
      userAgent,
    );

    if (!refreshToken) {
      throw new ServiceUnavailableException(
        'Failed to generate a refresh token',
      );
    }

    return {
      ...user,
      refreshToken,
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh-tokens')
  async refreshTokens(@Req() req: Request) {
    const user = req.user!;
    const refreshToken: string = user['refreshToken'];
    return await this.authService.refreshTokens(refreshToken);
  }
}
