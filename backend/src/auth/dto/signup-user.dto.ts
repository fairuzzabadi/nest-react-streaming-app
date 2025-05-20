import { IsEmail, IsString } from "class-validator";

export class SignupUserDto {
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}