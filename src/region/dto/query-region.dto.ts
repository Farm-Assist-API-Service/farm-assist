import { IsString } from 'class-validator';

export class QueryRegionDto {
  @IsString()
  active: boolean;
}
