import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryPeriod } from '../enums/query-period.enum';

export class PaginateDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  regionId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  orderBy?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  userId?: number;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsEnum(QueryPeriod, { message: 'Invalid query period' })
  period?: QueryPeriod;

  @IsOptional()
  @IsDateString()
  toDate?: Date;

  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsNumberString()
  day?: number;

  @IsOptional()
  @IsString()
  groupByDate?: string;

  @IsOptional()
  @IsString()
  profileType?: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  active?: string;
}
