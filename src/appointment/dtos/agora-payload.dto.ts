import { Optional } from '@nestjs/common';
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
import { EStreamRoles } from '../interfaces/appointment.service.interfaces';

export class AgoraPayloadDto {
  @IsAscii()
  readonly channelName: string;

  @IsNumber()
  readonly uid: number;

  @IsEnum(EStreamRoles)
  @IsOptional()
  role?: EStreamRoles;
}
