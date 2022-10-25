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
import { E_USER_ROLE } from 'src/core/schemas';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
