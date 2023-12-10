import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
