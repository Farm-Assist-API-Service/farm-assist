import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { CreateRegionDto } from './dto/create-region.dto';
import { QueryRegionDto } from './dto/query-region.dto';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

@Controller('region')
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  create(@Body() createRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  getAllRegions(
    @Query('active', ParseBoolPipe) active: boolean,
    // @Query() queryVariable: QueryRegionDto,
  ): Promise<Region[]> {
    const queryRegionDto: QueryRegionDto = {
      active,
    };

    return this.regionService.getRegions(queryRegionDto);
  }
}
