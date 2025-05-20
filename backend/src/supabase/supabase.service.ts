import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { writeFile } from 'fs';
import { promisify } from 'util';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly bucket = 'uploads'; // Set your bucket name

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }

  async upload(file: Buffer, path: string) {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .upload(path, file, {
          contentType: 'application/octet-stream',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      return { path };
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Failed to upload file');
    }
  }

  async delete(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      console.error(error);
      throw new ServiceUnavailableException('Failed to delete file');
    }
  }

  async deleteUnusedFiles(folder: string, usedFiles: string[]) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .list(folder);

      if (error) throw error;

      const filesToDelete = (data ?? [])
        .filter((item) => !usedFiles.includes(item.name))
        .map((item) => `${folder}/${item.name}`);

      if (filesToDelete.length > 0) {
        const { error: deleteError } = await this.supabase.storage
          .from(this.bucket)
          .remove(filesToDelete);

        if (deleteError) {
          throw deleteError;
        }
      }
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException('Failed to purge unused files');
    }
  }

  async download(path: string, dest: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .download(path);

      if (error) throw error;

      const writeFileAsync = promisify(writeFile);
      await writeFileAsync(dest, Buffer.from(await data.arrayBuffer()));
    } catch (e) {
      console.error(e);
      throw new ServiceUnavailableException(`Unable to download ${path}`);
    }
  }

  getUrl(path: string) {
    try {
      const { data } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(path);

      if (!data?.publicUrl) {
        throw new Error('No URL returned');
      }

      return data.publicUrl;
    } catch (e) {
      console.error(e);
      throw new NotFoundException(`${path} not found`);
    }
  }
}
