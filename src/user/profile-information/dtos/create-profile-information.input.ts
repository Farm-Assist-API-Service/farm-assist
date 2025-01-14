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
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';

import { ProfileInformation } from '../entities/profile-information.entity';

import { ProfileType } from '../enums/profile-information.enum';

export class CreateProfileInformationInput implements Partial<ProfileInformation> {
  @IsEnum(ProfileType)
  @IsOptional()
  readonly profileType?: ProfileType = ProfileType.REGULAR;

  @IsString()
  name: string;

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

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
