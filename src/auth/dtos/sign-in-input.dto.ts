import {
  IsAscii,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from 'src/user/user.entity';

export class SignInInput implements Partial<User> {
  @IsEmail()
  @MinLength(1)
  @IsOptional()
  readonly email?: string;

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
