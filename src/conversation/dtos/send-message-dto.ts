import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsAscii,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @IsAscii()
  @MinLength(5)
  readonly message: string;

  @IsNumber()
  readonly recipientId: number;
}
