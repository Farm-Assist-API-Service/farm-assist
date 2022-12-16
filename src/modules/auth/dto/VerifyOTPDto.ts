import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsNumberString,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';

export class VerifyOTPDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
