// import { VideoService } from './video.service';
// import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
// import { PrismaClient, User, Video } from '@prisma/client';
// import { PrismaService } from '../prisma/prisma.service';
// import { NotFoundException } from '@nestjs/common';
// import { Request, Response } from 'express';
// import * as fs from 'fs';
// import { FirebaseService } from '../firebase/firebase.service';

// describe('VideoService', () => {
//   let service: VideoService;
//   let prisma: DeepMockProxy<PrismaClient>;
//   let firebase: DeepMockProxy<FirebaseService>;

//   beforeAll(() => {
//     prisma = mockDeep<PrismaClient>();
//     firebase = mockDeep<FirebaseService>();

//     const prismaService = prisma as unknown as PrismaService;
//     const firebaseService = firebase as unknown as FirebaseService;

//     service = new VideoService(prismaService, firebaseService);
//     jest
//       .spyOn(service, 'computeVideoLength')
//       .mockImplementation(async (video) => null);
//   });

//   beforeEach(() => {
//     mockReset(prisma);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should create new video record', async () => {
//     const record: Video = {
//       coverImage: 'cover_image',
//       title: 'video_title',
//       video: 'file_name',
//       id: '',
//       uploadDate: new Date(),
//       userId: '',
//       length: null,
//     };
//     prisma.video.create.mockResolvedValue(record);

//     const mockUser: User = {
//       avatar: null,
//       createdDate: new Date(),
//       email: 'user@mail.com',
//       fullname: 'user',
//       id: '',
//       password: 'pass',
//     };
//     prisma.user.findUnique.mockResolvedValue(mockUser);

//     const { id, uploadDate, ...rest } = record;
//     const { userId, ...dto } = {
//       userEmail: 'user@mail.com',
//       ...rest,
//     };
//     await expect(service.createVideo(dto)).resolves.toStrictEqual(record);
//   });

//   it('gets one video record', async () => {
//     const videoId = 'video_id';
//     const record: Video = {
//       coverImage: 'cover_image',
//       title: 'video_title',
//       video: 'file_name',
//       id: videoId,
//       uploadDate: new Date(),
//       userId: '',
//       length: null,
//     };

//     prisma.video.findUnique.mockResolvedValue(record);
//     await expect(service.readOneVideo(videoId)).resolves.toStrictEqual(record);
//   });

//   it('throws 404 error for non-existent video', async () => {
//     prisma.video.findUnique.mockResolvedValue(null);
//     await expect(service.readOneVideo('mock_id')).rejects.toThrowError(
//       NotFoundException,
//     );
//   });

//   it('get all video records', async () => {
//     prisma.video.findMany.mockResolvedValue([]);
//     await expect(service.readVideos()).resolves.toEqual([]);
//   });

//   it('should throw 404 error on stream failure', async () => {
//     prisma.video.findUnique.mockResolvedValue(null);

//     let res = {} as Response;
//     let req = {} as Request;
//     await expect(service.streamVideo('', res, req)).rejects.toThrowError(
//       NotFoundException,
//     );
//   });

//   it('should update existing record', async () => {
//     const record: Video = {
//       coverImage: 'image_file',
//       id: 'video_id',
//       title: 'video_title',
//       uploadDate: new Date(),
//       userId: 'user_id',
//       video: 'file_name',
//       length: null,
//     };
//     prisma.video.upsert.mockResolvedValue(record);

//     const mockUser: User = {
//       avatar: null,
//       createdDate: new Date(),
//       email: 'user@mail.com',
//       fullname: 'user',
//       id: '',
//       password: 'pass',
//     };
//     prisma.user.findUnique.mockResolvedValue(mockUser);

//     const { uploadDate, id, ...rest } = record;
//     const { userId, ...dto } = {
//       userEmail: 'user@mail.com',
//       ...rest,
//     };
//     await expect(service.update(record.id, dto)).resolves.toStrictEqual(record);
//   });

//   it('throws 404 error on delete failure', async () => {
//     prisma.video.findUnique.mockResolvedValue(null);
//     await expect(service.delete('', 'user@mail.com')).rejects.toThrowError(
//       NotFoundException,
//     );
//   });

//   it('delete one video record', async () => {
//     const record = {
//       coverImage: 'image_file',
//       id: 'video_id',
//       title: 'video_title',
//       uploadDate: new Date(),
//       userId: 'user_id',
//       video: 'file_name',
//       length: null,
//       createdBy: {
//         email: 'user@mail.com',
//       },
//     };

//     prisma.video.findUnique.mockResolvedValue(record);
//     jest.spyOn(fs, 'unlink').mockImplementation((...args: any[]) => {});

//     await expect(service.delete('', 'user@mail.com')).resolves.not.toThrow();
//   });
// });
