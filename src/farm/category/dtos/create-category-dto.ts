import {
  IsArray,
  IsAscii,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsAscii()
  @MinLength(5)
  readonly name: string;

  @IsAscii()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
