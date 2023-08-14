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

export class ResetPasswordDto {
  @IsEmail()
  @MinLength(1)
  readonly email: string;
}
