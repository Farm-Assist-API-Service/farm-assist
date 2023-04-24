import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { PaginatedResponse } from 'src/core/interfaces/paginated-response';
import { EnumHelpers } from 'src/utils/helpers/Enum-helpers';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CurrencyService } from './curreny.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { QueryRegionDto } from './dto/query-region.dto';
import { Currency } from './entities/currency.entity';
import { Region } from './entities/region.entity';
import { RegionProviders } from './enums/region-providers.enum';
import { RegionInfoType } from './interfaces/providers-interface';
import { RegionProviderFactory } from './region-providers.factory';

type M = {
  name: boolean;
  code: boolean;
  demonym: boolean;
  currency: boolean;
  fields: string[];
};

@Injectable()
export class RegionService {
  private regionUrl: string;
  constructor(
    @InjectRepository(Region) private readonly regionRepo: Repository<Region>,
    private readonly currencyService: CurrencyService, // @InjectRepository(Currency) private readonly currRepo: Repository<Currency>,
    private readonly regionAPIProviderClass: RegionProviderFactory,
  ) {
    this.regionUrl = 'https://restcountries.com/v3.1/';
  }

  async create(createRegionDto: CreateRegionDto): Promise<any> {
    try {
      if (!createRegionDto.auto && !createRegionDto.regionDetails) {
        throw new HttpException(
          'If auto is not set, regionDetails is required in Region payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      const regions: Partial<Region[]> = await this.regionRepo.find({});

      // const match: M = {
      //   name: false,
      //   code: false,
      //   demonym: false,
      //   currency: false,
      //   fields: [],
      // };

      // regions.forEach((region) => {
      //   if (region.name === createRegionDto?.name) {
      //     match['name'] = true;
      //   }
      //   if (region.demonym === createRegionDto?.regionDetails?.demonym) {
      //     match['demonym'] = true;
      //   }
      //   if (region.code === createRegionDto?.regionDetails?.code) {
      //     match['code'] = true;
      //   }
      // });

      // for (const key in match) {
      //   if (Object.prototype.hasOwnProperty.call(match, key)) {
      //     const element = match[key];
      //     if (element && key !== 'fields') {
      //       match.fields.push(key);
      //     }
      //   }
      // }

      // if (match.fields.length) {
      //   throw new HttpException(
      //     `Sorry. ${`${match.fields}`
      //       .toUpperCase()
      //       .replace(/,/gi, ' && ')} already exist`,
      //     HttpStatus.CONFLICT,
      //   );
      // }

      // Fetch region and her currency info
      const regionInfo: RegionInfoType = await this.regionAPIProviderClass
        .findOne(RegionProviders.Restcountries)
        .getRegion(createRegionDto.name);

      if (!regionInfo) {
        throw new HttpException(
          'Sorry. Something went wrong kindly contact support',
          HttpStatus.EXPECTATION_FAILED,
        );
      }

      const currencies = await this.currencyService.findAll();

      // const currExist = currencies.find(
      //   (curr) =>
      //     curr.name === regionInfo.currency.name ||
      //     curr.symbol === regionInfo.currency.symbol ||
      // );

      const regionExist = regions.find(
        (region) =>
          region.name === regionInfo?.region.name ||
          region.code === regionInfo?.region.code,
      );

      if (regionExist) {
        throw new HttpException(
          'Sorry. Region already exist',
          HttpStatus.CONFLICT,
        );
      }

      const currency: Currency = await this.currencyService.create({
        name: regionInfo.currency.name,
        code: regionInfo.currency.code,
        symbol: regionInfo.currency.symbol,
        isDefault: !currencies.length,
      });

      const newRegion = this.regionRepo.create({
        currency,
        ...regionInfo.region,
        isDefault: !regions.length,
      });
      return await this.regionRepo.save(newRegion);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: RegionService.name,
          operator: this.create.name,
        },
        report: 'Failed to create Region',
      });
    }
  }

  async getRegions(queryRegionDto: QueryRegionDto): Promise<Region[]> {
    try {
      const whereOption = {
        where: queryRegionDto.active ? { isActive: queryRegionDto.active } : {},
      };
      return await this.regionRepo.find(whereOption);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: RegionService.name,
          operator: this.getRegions.name,
        },
        report: 'Failed to getRegions',
      });
    }
  }

  async paginate(paginateDto: PaginateDto): Promise<PaginatedResponse> {
    try {
      const { sortBy, orderBy, page, limit, query } = paginateDto;
      const allowedLimit = Math.min(+limit, 40);
      const skippedItems = (page - 1) * allowedLimit;

      const queryBuilder = this.regionRepo.createQueryBuilder('region');
      if (query) {
        const whereQuery = 'LOWER(region.name) like LOWER(:name)';
        const whereParams = { name: `%${query}%` };
        queryBuilder.where(whereQuery, whereParams);
      }

      queryBuilder.orderBy(`region.${sortBy || 'id'}`, orderBy || 'DESC');
      queryBuilder.skip(skippedItems).take(allowedLimit);
      const regionData = await queryBuilder.getMany();
      const regionCount = await queryBuilder.getCount();
      return {
        page: paginateDto.page,
        limit: allowedLimit,
        totalCount: regionCount,
        data: regionData,
      };
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: RegionService.name,
          operator: this.paginate.name,
        },
        report: 'Failed to paginate Regions',
      });
    }
  }

  async findById(id: number): Promise<Region> {
    return await this.regionRepo.findOne({ where: { id } });
  }

  async findOneBy(query: FindOptionsWhere<Region>): Promise<Region> {
    const region = await this.regionRepo.findOne({ where: query });
    return region;
  }
}
