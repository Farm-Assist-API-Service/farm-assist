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

export class CancelAppointmentDto {
  @IsAscii()
  @MinLength(5)
  @Optional()
  readonly reason?: string;
}
