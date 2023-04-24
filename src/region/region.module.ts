import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { Currency } from './entities/currency.entity';
import { CurrencyService } from './curreny.service';
import { RegionProviderFactory } from './region-providers.factory';
import { RestcountriesService } from './providers/restcountries.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Currency])],
  providers: [
    RegionService,
    CurrencyService,
    RegionProviderFactory,
    RestcountriesService,
  ],
  controllers: [RegionController],
  exports: [CurrencyService, RegionProviderFactory],
})
export class RegionModule {}
