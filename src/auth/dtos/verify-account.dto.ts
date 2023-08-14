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

export class VerifyAccountDto {
  @IsString()
  @MinLength(1)
  readonly identifier: string;

  @IsString()
  @MinLength(1)
  readonly otp: string;
}
