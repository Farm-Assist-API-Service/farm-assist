import {
  IsArray,
  IsAscii,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { EMailSource } from '../interfaces/email-service.interface';

export class SendMailDto {
  @IsString()
  @IsNotEmpty()
  readonly subject: string;

  @IsString()
  @IsNotEmpty()
  readonly subTitle: string;

  @IsArray()
  @IsNotEmpty()
  readonly recipients: string[];

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsString()
  @IsOptional()
  readonly campaignId?: string;

  @IsString()
  @IsOptional()
  contentId?: string;

  @IsOptional()
  context?: any;

  @IsString()
  @IsOptional()
  html?: string;

  @IsEnum(EMailSource)
  @IsOptional()
  readonly source? = EMailSource.FARM_ASSIST;

  @IsBoolean()
  @IsNotEmpty()
  readonly save: boolean = false;
}
