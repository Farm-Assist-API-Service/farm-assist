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

export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
