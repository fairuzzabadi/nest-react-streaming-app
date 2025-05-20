import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';
import { ConfigModule } from '@nestjs/config';
import {
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  FirebaseStorage,
  deleteObject,
  getMetadata,
  ref,
} from 'firebase/storage';
import { join } from 'path';
import { existsSync, unlink } from 'fs';
import { promisify } from 'util';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let storage: FirebaseStorage;
  const mockFile = 'folder/file';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseService],
      imports: [ConfigModule],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);

    const env = await initializeTestEnvironment({ projectId: 'demo-plays' });
    const ctx = env.authenticatedContext('user');

    storage = ctx.storage();
    jest.spyOn(service, 'getStorage').mockReturnValue(storage);
  });

  beforeEach(async () => {
    const data = Buffer.from('mock data', 'utf-8');
    await assertSucceeds(service.upload(data, mockFile));
  });

  afterEach(async () => {
    try {
      const fileRef = ref(storage, mockFile);
      await deleteObject(fileRef);
    } catch {}
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file', async () => {
    const fileRef = ref(storage, mockFile);
    await expect(getMetadata(fileRef)).resolves.toBeDefined();
  });

  it('should download file', async () => {
    const filePath = join(__dirname, "mock_file");
    await service.download(mockFile, filePath);

    expect(existsSync(filePath)).toBeTruthy();

    const unlinkAsync = promisify(unlink);
    await unlinkAsync(filePath);
  });

  it('should delete file from storage', async () => {
    await assertSucceeds(service.delete(mockFile));
  });

  it('should returns file url', async () => {
    await expect(service.getUrl(mockFile)).resolves.toBeDefined();
  });
});
