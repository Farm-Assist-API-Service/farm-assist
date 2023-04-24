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
import { UserSource } from 'src/core/enums/sourceInfo';
import { User } from 'src/user/user.entity';

export class SignUpInput implements Partial<User> {
  @IsAscii()
  @MinLength(1)
  readonly firstName: string;

  @IsAscii()
  @MinLength(1)
  @IsOptional()
  readonly middleName?: string;

  @IsAscii()
  @MinLength(1)
  readonly lastName: string;

  @IsEmail()
  @MinLength(1)
  readonly email: string;

  // @IsAscii()
  @IsStrongPassword()
  @MinLength(8)
  readonly password: string;

  @IsAscii()
  @MinLength(8)
  @IsOptional()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly inviteCode?: string;

  @IsNumber()
  readonly regionId: number;

  @IsEnum(UserSource)
  readonly source: UserSource;
}
