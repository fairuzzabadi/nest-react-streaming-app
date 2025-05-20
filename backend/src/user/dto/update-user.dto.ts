import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}