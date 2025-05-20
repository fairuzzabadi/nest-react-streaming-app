import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';
import { existsSync, unlink } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

jest.mock('@supabase/supabase-js', () => {
  const actual = jest.requireActual('@supabase/supabase-js');

  return {
    ...actual,
    createClient: () => ({
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn((path, file) => Promise.resolve({ data: { path }, error: null })),
          remove: jest.fn(() => Promise.resolve({ error: null })),
          getPublicUrl: jest.fn((path) => ({ data: { publicUrl: `https://fake.supabase.co/${path}` } })),
          download: jest.fn(() =>
            Promise.resolve({
              data: {
                arrayBuffer: async () => Buffer.from('mock file content'),
              },
              error: null,
            })
          ),
          list: jest.fn(() =>
            Promise.resolve({
              data: [
                { name: 'file1.txt' },
                { name: 'file2.txt' },
              ],
              error: null,
            })
          ),
        })),
      },
    }),
  };
});

describe('SupabaseService', () => {
  let service: SupabaseService;
  const mockFilePath = 'folder/file.txt';
  const fileContent = Buffer.from('mock content');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file', async () => {
    const result = await service.upload(fileContent, mockFilePath);
    expect(result).toHaveProperty('path', mockFilePath);
  });

  it('should download file', async () => {
    const filePath = join(__dirname, 'test_download.txt');
    await service.download(mockFilePath, filePath);

    expect(existsSync(filePath)).toBeTruthy();

    const unlinkAsync = promisify(unlink);
    await unlinkAsync(filePath);
  });

  it('should delete file', async () => {
    await expect(service.delete(mockFilePath)).resolves.toBeUndefined();
  });

  it('should return file URL', () => {
    const url = service.getUrl(mockFilePath);
    expect(url).toContain(mockFilePath);
  });

  it('should delete unused files in folder', async () => {
    await expect(service.deleteUnusedFiles('folder', ['file2.txt'])).resolves.toBeUndefined();
  });
});
