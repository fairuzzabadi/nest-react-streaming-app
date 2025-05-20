import {
  ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const msg = exception.message.replace(/\n/g, '');
    
    switch (exception.code) {
      case 'P2002':
        const status = HttpStatus.CONFLICT;
        res.status(status).json({
          statusCode: status,
          message: msg,
        });
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}
