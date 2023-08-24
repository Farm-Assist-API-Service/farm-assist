import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { SendMailDto } from './send-mail.dto';

export class SendMailPayload extends OmitType(SendMailDto, ['recipients']) {
  @IsString()
  readonly receipient: string;

  @IsString()
  @IsOptional()
  readonly fileName?: string;
}
