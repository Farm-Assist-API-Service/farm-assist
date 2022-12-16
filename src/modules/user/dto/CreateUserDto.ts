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
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ROLE, GENDER } from 'src/modules/user/enums';

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

  @IsOptional()
  @IsPhoneNumber('NG')
  @IsNumberString()
  @Length(11, 11)
  phone?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Matches(
    `^${Object.values(ROLE)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  readonly role: ROLE = ROLE.USER;

  @IsOptional()
  @IsString()
  readonly inviteCode?: string;

  @IsOptional()
  @IsNumber()
  readonly regionId: number;
}
