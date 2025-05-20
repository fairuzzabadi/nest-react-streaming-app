import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResetPasswordService {
  codes: Record<string, string>; // code -> email

  constructor(private prisma: PrismaService) {
    this.codes = {};
  }

  validateCode(code: string) {
    return code in this.codes;
  }

  getAssociatedEmail(code: string) {
    if (this.validateCode(code)) {
      return this.codes[code];
    }

    return '';
  }

  async generateCode(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const num = Math.floor(Math.random() * 9999);
      let key = `${num}`;
      while (key.length < 4) key = '0' + key;

      this.codes[key] = email;

      // code expires in 5 minutes
      setTimeout(() => {
        delete this.codes[key];
      }, 5 * 60 * 1000);

      return {
        code: key,
      };
    }

    throw new BadRequestException(`No user with email : ${email}`);
  }
}
