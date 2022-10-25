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
import { E_USER_ROLE, E_USER_GENDER } from '../../core/schemas';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('NG')
  @IsNumberString()
  @Length(11, 11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Matches(
    `^${Object.values(E_USER_GENDER)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  gender: E_USER_GENDER;

  @Matches(
    `^${Object.values(E_USER_ROLE)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  role: E_USER_ROLE;
}
