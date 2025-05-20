import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResetPasswordService } from './reset-password.service';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';
import { NotAcceptableException } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: DeepMockProxy<AuthService>;
  let mailService: MailService;
  let codeService: ResetPasswordService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prisma = mockDeep<PrismaClient>();
    authService = mockDeep<AuthService>();

    const prismaService = prisma as unknown as PrismaService;

    codeService = new ResetPasswordService(prismaService);
    mailService = {
      sendMail: async () => 'mail sent',
    } as unknown as MailService;

    controller = new AuthController(
      authService,
      mailService,
      codeService,
      prismaService,
    );
  });

  beforeEach(() => {
    mockReset(prisma);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw error with invalid reset code', () => {
    expect(() => {
      controller.validateResetCode({
        code: 'code',
      });
    }).toThrowError(NotAcceptableException);
  });

  it('should validate reset code correctly', async () => {
    jest.spyOn(codeService, 'validateCode').mockReturnValueOnce(true);
    expect(
      controller.validateResetCode({
        code: 'code',
      }),
    ).toBe('ok');
  });

  it('resets user password', async () => {
    const record: User = {
      avatar: null,
      createdDate: new Date(),
      email: 'user@mail.com',
      fullname: 'user',
      id: '',
      password: '',
    };
    prisma.user.findUnique.mockResolvedValueOnce(record);
    jest.spyOn(codeService, 'generateCode').mockResolvedValue({
      code: '0000',
    });

    await expect(
      controller.resetPassword({
        email: 'user@mail.com',
      }),
    ).resolves.toBe('Check your mailbox');
  });

  it('registers a new user', async () => {
    const user: SignupUserDto = {
      email: 'user@mail.com',
      fullname: 'user',
      password: '',
    };
    authService.signup.mockResolvedValue({
      id: '',
      email: user.email,
      fullname: user.fullname,
    });

    await expect(controller.signup(user)).resolves.not.toBeNull();
  });

  it('sign in a user', async () => {
    const req = {
      headers: {
        'user-agent': '',
      },
    } as unknown as Request;
    const userId = 'user_id';
    const tokens = {
      accessToken: 'TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };

    authService.signin.mockResolvedValue({
      token: tokens.accessToken,
      id: userId,
    });
    authService.generateRefreshToken.mockResolvedValue(tokens.refreshToken);

    await expect(
      controller.signin(
        req,
        {
          email: 'user@mail.com',
          password: '0000',
        },
        '0.0.0.0',
      ),
    ).resolves.toEqual({
      id: userId,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  it('generate new tokens', async () => {
    const req = {
      user: {
        refreshToken: 'REFRESH_TOKEN',
      },
    } as unknown as Request;
    const res = {
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    };

    jest.spyOn(authService, 'refreshTokens').mockResolvedValue(res);

    await expect(controller.refreshTokens(req)).resolves.toEqual(res);
  });
});
