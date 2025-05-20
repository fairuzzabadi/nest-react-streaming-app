import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { writeFile } from 'fs';
import { promisify } from 'util';

@Injectable()
export class FirebaseService {
  private app: FirebaseApp;

  constructor(configService: ConfigService) {
    this.app = initializeApp({
      apiKey: configService.get<string>('API_KEY'),
      authDomain: configService.get<string>('AUTH_DOMAIN'),
      projectId: configService.get<string>('PROJECT_ID'),
      storageBucket: configService.get<string>('STORAGE_BUCKET'),
      messagingSenderId: configService.get<string>('MESSAGING_SENDER_ID'),
      appId: configService.get<string>('APP_ID'),
      measurementId: configService.get<string>('MEASUREMENT_ID'),
    });
  }

  getStorage() {
    return getStorage(this.app);
  }

  upload(file: Buffer, dest: string) {
    const storage = this.getStorage();
    const destRef = ref(storage, dest);
    try {
      return uploadBytes(destRef, file);
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Failed to upload video');
    }
  }

  delete(file: string) {
    const storage = this.getStorage();
    const fileRef = ref(storage, file);
    return deleteObject(fileRef);
  }

  async deleteUnusedFiles(folder: string, usedFiles: string[]) {
    const storage = this.getStorage();
    const folderRef = ref(storage, folder);
    try {
      const files = await list(folderRef);
      for (let file of files.items) {
        if (!usedFiles.includes(file.name)) {
          await deleteObject(file);
        }
      }
    } catch {
      throw new ServiceUnavailableException('Failed to purge unused files');
    }
  }

  async download(file: string, dest: string) {
    try {
      const storage = this.getStorage();
      const fileRef = ref(storage, file);
      const url = await getDownloadURL(fileRef);
      const res = await fetch(url);
      const buf = await res.arrayBuffer();

      const writeFileAsync = promisify(writeFile);
      await writeFileAsync(dest, Buffer.from(buf));
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(`Unable to download ${file}`);
    }
  }

  getUrl(file: string) {
    const storage = this.getStorage();
    const fileRef = ref(storage, file);
    try {
      return getDownloadURL(fileRef);
    } catch (e) {
      console.error(e);
      throw new NotFoundException(`${file} not found`);
    }
  }
}
