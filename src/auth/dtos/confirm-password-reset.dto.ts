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
import { ResetPasswordConfirmDto } from './reset-password-confirm.dto';

export class ConfirmPasswordResetDto extends ResetPasswordConfirmDto {}
