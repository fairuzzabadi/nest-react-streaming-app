import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Redirect,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { AccessTokenGuard } from '../auth/guards/acces-token.guard';
import { ResetPasswordService } from '../auth/reset-password.service';
import { FirebaseService } from '../firebase/firebase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { SetPasswordDto } from './dto/set-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private codeService: ResetPasswordService,
    // private configService: ConfigService,
    // private firebase: FirebaseService,
    private supabase: SupabaseService
  ) {}

  @Get('picture/:filename')
  @Redirect()
  async getUserPicture(@Param('filename') filename: string) {
    // const url = await this.firebase.getUrl(`datas/images/${filename}`);
    const url = await this.supabase.getUrl(`datas/images/${filename}`);
    return { url };
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  async updateUserDatas(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
    },
  ) {
    let picture = files.avatar?.at(0);
    if (picture) {
      const file = readFileSync(picture.path);
      try {
        // await this.firebase.upload(file, `datas/images/${picture.filename}`);
        await this.supabase.upload(file, `datas/images/${picture.filename}`);
      } catch {
        console.error('Unable to set user picture');
        picture = undefined;
      }
    }

    await this.userService.updateUser(id, {
      ...dto,
      avatar: picture?.filename,
    });
    return 'User datas updated';
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getOne(id);
    if (user) {
      return user;
    }

    throw new NotFoundException(`No user found with ID ${id}`);
  }

  @Post('/password')
  async setPassword(@Body() dto: SetPasswordDto) {
    if (!this.codeService.validateCode(dto.code)) {
      throw new ForbiddenException('Invalid code provided.');
    }

    const email = this.codeService.getAssociatedEmail(dto.code);
    await this.userService.setPassword(email, dto.password);

    return 'Password successfully set';
  }
}
