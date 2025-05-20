import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Request } from 'express';
import * as fs from 'fs/promises';
import { join } from 'path';
import { AccessTokenGuard } from '../auth/guards/acces-token.guard';
import { FirebaseService } from '../firebase/firebase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaClientExceptionFilter } from '../prisma-client-exception/prisma-client-exception.filter';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoService } from './video.service';

@Controller('video')
@UseFilters(PrismaClientExceptionFilter)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private prisma: PrismaService,
    // private firebase: FirebaseService,
    private supabase: SupabaseService,
  ) {}

  @Patch(':id')
  @UseInterceptors(FileInterceptor('cover'))
  async update(
    @Param('id') id: string,
    @Body() updateVideo: UpdateVideoDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const video = await this.prisma.video.findUnique({
        where: { id },
        select: { coverImage: true },
      });

      if (!video) {
        throw new NotFoundException(`No video with given ID : ${id}`);
      }

      await this.prisma.video.update({
        where: { id },
        data: {
          coverImage: file.filename,
        },
      });

      // upload new file

      const cover = await fs.readFile(file.path);
      // await this.firebase.upload(cover, `datas/videos/${file.filename}`);
      await this.supabase.upload(cover, `datas/videos/${file.filename}`);

      // remove old file

      try {
        const coverPath = join(
          __dirname,
          '../..',
          `public/datas/videos/${video.coverImage}`,
        );
        await fs.rm(coverPath);
      } catch {
        console.error(`Image file ${video.coverImage} doesn't exist`);
      }

      // await this.firebase.delete(`datas/videos/${video.coverImage}`);
      await this.supabase.delete(`datas/videos/${video.coverImage}`);
    }

    if (updateVideo.title) {
      await this.prisma.video.update({
        where: {
          id,
        },
        data: {
          title: updateVideo.title,
        },
      });
    }

    return 'Video record updated';
  }

  @Get('cover/:filename')
  @Redirect()
  async getCoverFile(@Param('filename') filename: string) {
    return {
      // url: await this.firebase.getUrl(`datas/videos/${filename}`),
      url: await this.supabase.getUrl(`datas/videos/${filename}`),
    };
  }

  @Get('a')
  @UseGuards(AccessTokenGuard)
  async readVideos(@Query('user') userId?: string) {
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
        },
      });

      if (!user) {
        throw new BadRequestException(`No user with ID ${userId}`);
      }

      const videos = await this.videoService.getUsersVideos(user['email']);
      if (!videos) {
        throw new NotFoundException('No video found for this user');
      }

      return videos.map((record) => {
        const { video, ...datas } = record;
        return datas;
      });
    }

    const videos = await this.videoService.readVideos();
    if (!videos) {
      throw new NotFoundException('No video found');
    }

    return videos.map((record) => {
      const { video, ...datas } = record;
      return datas;
    });
  }

  @Get(':id')
  stream(@Param('id') id: string, @Res() res, @Req() req) {
    return this.videoService.streamVideo(id, res, req);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async readUserVideo(@Req() req: Request, @Query('id') id: string) {
    if (id) {
      const record = await this.videoService.readOneVideo(id);
      if (!record) {
        throw new NotFoundException('Video non-existent.');
      }

      const { video, ...datas } = record;
      return datas;
    }

    // return user's videos
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const videos = await this.videoService.getUsersVideos(user['email']);
    if (!videos) {
      throw new NotFoundException('No video found for this user');
    }

    return videos.map((record) => {
      const { video, ...datas } = record;
      return datas;
    });
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  async delete(@Req() req: Request, @Param('id') id: string) {
    const email = req.user!['email'];
    return this.videoService.delete(id, email);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  async postVideo(
    @Req() req: Request,
    @Body()
    video: {
      title: string;
    },
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },
  ) {
    if (!files.video || !files.cover) {
      throw new BadRequestException('No video or cover image provided');
    }

    if (!req.user) {
      throw new UnauthorizedException();
    }

    const payload = {
      title: video.title,
      video: files.video[0].filename,
      coverImage: files.cover[0].filename,
      userEmail: req.user['email'],
    };

    {
      // Upload files

      const video = await fs.readFile(files.video[0].path);
      // await this.firebase.upload(
      //   video,
      //   `datas/videos/${files.video[0].filename}`,
      // );
      await this.supabase.upload(
        video,
        `datas/videos/${files.video[0].filename}`,
      );

      const cover = await fs.readFile(files.cover[0].path);
      // await this.firebase.upload(
      //   cover,
      //   `datas/videos/${files.cover[0].filename}`,
      // );
      await this.supabase.upload(
        cover,
        `datas/videos/${files.cover[0].filename}`,
      );
    }

    return this.videoService.createVideo(payload);
  }
}
