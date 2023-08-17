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
  @IsOptional()
  readonly profileType?: ProfileType = ProfileType.REGULAR;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  homeAddress?: string;

  @IsString()
  @IsOptional()
  workAddress?: string;

  @IsString()
  @IsOptional()
  fcmToken?: string;
}
