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
import { CreateProfileInformationInput } from './create-profile-information.input';

export class VerifyProfileInformationInput extends PartialType(
  CreateProfileInformationInput,
) {}
