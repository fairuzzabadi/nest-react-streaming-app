import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { PostVideoDto } from './dto/post-video.dto';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import getVideoDurationInSeconds from 'get-video-duration';
import { Video } from '@prisma/client';
import { FirebaseService } from '../firebase/firebase.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class VideoService {
  constructor(
    private prisma: PrismaService,
    // private firebase: FirebaseService,
    private supabase: SupabaseService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async purgeUnusedFiles() {
    const records = await this.prisma.video.findMany({
      select: {
        coverImage: true,
        video: true,
      },
    });

    await this.supabase.deleteUnusedFiles(
      'datas/videos',
      records
        .map((record) => [record.coverImage, record.video])
        .reduce((prev, curr) => [...prev, ...curr], []),
    );
  }

  async computeVideoLength(video: Video) {
    try {
      const videoPath = join(
        __dirname,
        '../..',
        `./public/datas/videos/${video.video}`,
      );
      if (!fs.existsSync(videoPath)) {
        // await this.firebase.download(`datas/videos/${video.video}`, videoPath);
        await this.supabase.download(`datas/videos/${video.video}`, videoPath);
      }

      const duration = await getVideoDurationInSeconds(videoPath);
      await this.prisma.video.update({
        where: {
          id: video.id,
        },
        data: {
          length: duration,
        },
      });
      return duration;
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async createVideo(video: PostVideoDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: video.userEmail },
      select: { id: true },
    });

    if (!user) {
      throw new UnauthorizedException('User non-existent');
    }

    return await this.prisma.video.create({
      data: {
        coverImage: video.coverImage,
        title: video.title,
        video: video.video,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async readOneVideo(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`No video with ID ${id}`);
    }

    if (!video.length) {
      video.length = await this.computeVideoLength(video);
    }

    return video;
  }

  async getUsersVideos(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`No user with email ${email} found`);
    }

    const videos = await this.prisma.video.findMany({
      where: {
        userId: user.id,
      },
    });

    for (let video of videos) {
      if (!video.length) {
        video.length = await this.computeVideoLength(video);
      }
    }

    return videos;
  }

  async readVideos() {
    const videos = await this.prisma.video.findMany({
      include: { createdBy: true },
    });

    for (let video of videos) {
      if (!video.length) {
        video.length = await this.computeVideoLength(video);
      }
    }

    return videos;
  }

  async streamVideo(id: string, res: Response, req: Request) {
    try {
      const data = await this.prisma.video.findUnique({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException('Video not found');
      }

      const { range } = req.headers;
      if (range) {
        const { video } = data;
        const videoPath = join(
          __dirname,
          '../..',
          `public/datas/videos/${video}`,
        );

        if (!fs.existsSync(videoPath)) {
          // download file form firebase storage
          // await this.firebase.download(`datas/videos/${video}`, videoPath);
          await this.supabase.download(`datas/videos/${video}`, videoPath);
        }

        const videoInfo = statSync(videoPath);
        const CHUNK_SIZE = 1024 * 1024; // 1Mb
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, videoInfo.size - 1);
        const videoLength = end - start + 1;
        res.status(HttpStatus.PARTIAL_CONTENT);
        res.header({
          'Content-Range': `bytes ${start}-${end}/${videoInfo.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': videoLength,
          'Content-Type': 'video/mp4',
        });

        const videoStream = createReadStream(videoPath, {
          start,
          end,
        });
        videoStream.pipe(res);
      } else {
        throw new BadRequestException('Range not found');
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        console.error(e);
        throw new ServiceUnavailableException();
      }
    }
  }

  async delete(id: string, userEmail: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    if (video.createdBy.email !== userEmail) {
      throw new UnauthorizedException(
        'You have not the right to delete this video',
      );
    }
    
    await this.prisma.video.delete({ where: { id } });

    for (let path of [video.video, video.coverImage]) {
      // await this.firebase.delete(`datas/videos/${path}`);
      await this.supabase.delete(`datas/videos/${path}`);
      fs.unlink(
        join(__dirname, '../..', `./public/datas/videos/${path}`),
        (err) => {
          if (err) {
            console.error(err);
          }
        },
      );
    }
  }
}
