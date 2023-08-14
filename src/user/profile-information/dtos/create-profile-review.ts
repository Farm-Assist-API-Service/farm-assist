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
  IsNumber,
} from 'class-validator';
import { ProfileReview } from '../entities/profile-review.entity';

export class CreateProfileReviewDto implements Partial<ProfileReview> {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  profileId?: number;

  @IsNumber()
  rating: number;
}
