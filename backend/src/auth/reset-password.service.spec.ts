import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ResetPasswordService } from './reset-password.service';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: ResetPasswordService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prisma = mockDeep<PrismaClient>();
    service = new ResetPasswordService(prisma as unknown as PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns true for valid code', () => {
    const code = '0000';
    service.codes[code] = 'user@mail.com';
    expect(service.validateCode(code)).toEqual(true);

    service.codes = {};
  });

  it('returns email associted with code', () => {
    const code = '0000';
    const email = 'user@mail.com';
    service.codes[code] = email;

    expect(service.getAssociatedEmail(code)).toBe(email);

    service.codes = {};
  });

  it('returns empty string for invalid code', () => {
    expect(service.getAssociatedEmail('0000')).toBe('');
  });

  it('generates four digits code', async () => {
    const email = 'user@mail.com';
    const record: User = {
      avatar: null,
      createdDate: new Date(),
      fullname: 'user',
      id: '',
      password: '',
      email,
    };
    prisma.user.findUnique.mockResolvedValue(record);

    const { code } = await service.generateCode(email);
    expect(code.length).toBe(4);
  });

  it('throws error for non existent user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.generateCode('user@mail.com')).rejects.toThrowError(
      BadRequestException,
    );
  });
});
