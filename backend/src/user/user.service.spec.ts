import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const user = {
    id: '0',
    email: 'user1@mail.com',
    password: '0000',
    fullname: 'user 1',
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          avatar: null,
        }),
        update: jest.fn().mockResolvedValue({
          email: user.email,
        }),
      },
    } as unknown as PrismaService;
    service = new UserService(prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get one user by ID', async () => {
    const res = await service.getOne(user.id);
    expect(res).toBeTruthy();
  });

  it('get one user by email', async () => {
    const res = await service.getOneByEmail(user.email);
    expect(res).toBeTruthy();
  });

  it('should set one user password', async () => {
    const newPassword = 'new password';
    const res = await service.setPassword(user.email, newPassword);
    expect(res).toBeTruthy();

    const query = jest.spyOn(prisma.user, 'update').mock.calls[0][0];
    await expect(
      bcrypt.compare(newPassword, query.data.password as string),
    ).resolves.toBeTruthy();
  });
});
