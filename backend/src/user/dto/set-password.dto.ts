import { IsString } from "class-validator";

export class SetPasswordDto {
  @IsString()
  code: string;

  @IsString()
  password: string;
}