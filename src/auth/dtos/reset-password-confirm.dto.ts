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

export class ResetPasswordConfirmDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(1)
  readonly otp: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}
