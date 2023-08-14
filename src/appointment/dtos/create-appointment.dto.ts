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
import { ELocation } from 'src/core/enums/location.enum';
import { EUnitOfTime } from 'src/core/enums/unit-of-time.enum ';

export class CreateAppointmentDto {
  @IsAscii()
  @MinLength(5)
  readonly title: string;

  @IsAscii()
  @IsOptional()
  readonly description?: string;

  @IsArray()
  guestIds: number[];

  @IsEnum(EUnitOfTime)
  @IsOptional()
  readonly unitOfTime: EUnitOfTime;

  @IsNumber()
  readonly duration: number;

  @IsEnum(ELocation)
  @IsOptional()
  readonly location: ELocation;

  @IsDateString()
  readonly date: Date;
}
