// File: src/auth/dto/register.dto.ts
import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum UserRole {
  PROVIDER = 'provider',
  SEEKER = 'seeker',
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole; // 'provider' or 'seeker'
}
