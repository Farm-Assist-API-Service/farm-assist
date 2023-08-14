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
import { SignUpInput } from '../../auth/dtos/sign-up.dto';

export class CreateUserDto extends SignUpInput {}
