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

export class CreateProfileInformationInput
  implements Partial<ProfileInformation>
{
  @IsEnum(ProfileType)
  readonly profileType: ProfileType;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  homeAddress?: string;

  @IsString()
  @IsOptional()
  workAddress?: string;
}
