import { PartialType } from '@nestjs/mapped-types';
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

import { ProfileInformation } from '../entities/profile-information.entity';

import { ProfileType } from '../enums/profile-information.enum';
import { CreateProfileInformationInput } from './create-profile-information.input';

export class UpdateProfileInformationInput extends PartialType(
  CreateProfileInformationInput,
) {
  @IsString()
  @IsOptional()
  fcmToken?: string;
}
