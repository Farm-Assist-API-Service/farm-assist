import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaymentProviders } from 'src/payment/enums/payment-providers.enum';

class RegionDetails {
  @IsString()
  @IsOptional()
  flagPng: string;

  @IsString()
  @IsOptional()
  flagSvg: string;

  @IsString()
  code: string;

  @IsBoolean()
  @IsOptional()
  isActive = false;

  @IsNumber()
  currId: number;

  @IsString()
  demonym: string;
}

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsEnum(PaymentProviders)
  paymentProvider: PaymentProviders;

  @IsObject()
  @IsOptional()
  regionDetails?: RegionDetails;

  @IsBoolean()
  auto = true;
}
