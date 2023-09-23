import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import {
  IsAscii,
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsISO8601,
  IsInt,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { CreateUserDto } from './createUserDto.dto';

export class VerifyUserInformationInput extends PartialType(CreateUserDto) {}
