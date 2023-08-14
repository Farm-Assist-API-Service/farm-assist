import {
  IsAscii,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ProfileType } from 'src/user/profile-information/enums/profile-information.enum';
import { User } from 'src/user/user.entity';

export class SignInInput implements Partial<User> {
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly identifier?: string;

  @IsPhoneNumber()
  @MinLength(1)
  @IsOptional()
  readonly phone?: string;

  @IsAscii()
  @IsOptional()
  readonly password?: string;

  @MinLength(1)
  @IsOptional()
  @IsString()
  readonly deviceId?: string;

  @IsString()
  @IsOptional()
  readonly signature?: string;

  @IsEnum(ProfileType)
  readonly profileType: ProfileType;
}

export class SignInAsUserInput implements Partial<User> {
  @IsEmail()
  @MinLength(1)
  @IsOptional()
  readonly email?: string;

  @MinLength(1)
  @IsOptional()
  @IsString()
  readonly deviceId?: string;

  @IsString()
  @IsOptional()
  readonly signature?: string;
}
