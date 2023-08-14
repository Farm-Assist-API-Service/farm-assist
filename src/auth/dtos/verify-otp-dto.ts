import {
  IsAscii,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @MinLength(1)
  readonly email: string;

  @IsString()
  @MinLength(1)
  readonly otp: string;
}
