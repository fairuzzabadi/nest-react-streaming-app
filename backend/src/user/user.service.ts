import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: string, data: UpdateUserDto) {
    let password: string | undefined;
    if (data.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(data.password, salt);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        avatar: true,
      },
    });
    if (user?.avatar && data.avatar) {
      const file = join(__dirname, '../..', `./public/datas/images/${user.avatar}`);
      fs.unlink(file, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        password,
      },
    });
  }

  async getOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
        fullname: true,
        id: true,
        avatar: true,
      },
    });
  }

  async getOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        fullname: true,
        id: true,
        avatar: true,
      },
    });
  }

  async setPassword(email: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException(`No user with email ${email} found`);
    }

    const salt = await bcrypt.genSalt();
    const encrypted = await bcrypt.hash(newPassword, salt);
    return await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: encrypted,
      },
      select: {
        email: true,
      },
    });
  }
}
