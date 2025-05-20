import { IsEmail, IsString } from 'class-validator';

export class PostVideoDto {
  @IsString()
  title: string;

  @IsString()
  video: string;

  @IsString()
  coverImage: string;

  @IsEmail()
  userEmail: string;
}
