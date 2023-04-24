import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { PaginatedResponse } from 'src/core/interfaces/paginated-response';
import { EnumHelpers } from 'src/utils/helpers/Enum-helpers';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

type M = {
  name: boolean;
  code: boolean;
  demonym: boolean;
  currency: boolean;
  fields: string[];
};

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency) private readonly currRepo: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: Partial<Currency>): Promise<Currency> {
    try {
      const isExist = await this.currRepo.findOneBy({
        name: createCurrencyDto.name,
      });

      if (isExist) {
        throw new HttpException(
          'Sorry. Currency unavailable',
          HttpStatus.CONFLICT,
        );
      }

      const currency = this.currRepo.create(createCurrencyDto);
      return await this.currRepo.save(currency);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: CurrencyService.name,
          operator: this.create.name,
        },
        report: 'Failed to create currency',
      });
    }
  }

  // async paginate(paginateDto: PaginateDto): Promise<PaginatedResponse> {
  //   try {
  //     const { sortBy, orderBy, page, limit, query } = paginateDto;
  //     const allowedLimit = Math.min(+limit, 40);
  //     const skippedItems = (page - 1) * allowedLimit;

  //     const queryBuilder = this.currRepo.createQueryBuilder('currency');
  //     if (query) {
  //       const whereQuery = 'LOWER(currency.name) like LOWER(:name)';
  //       const whereParams = { name: `%${query}%` };
  //       queryBuilder.where(whereQuery, whereParams);
  //     }

  //     queryBuilder.orderBy(`currency.${sortBy || 'id'}`, orderBy || 'DESC');
  //     queryBuilder.skip(skippedItems).take(allowedLimit);
  //     const currData = await queryBuilder.getMany();
  //     const currCount = await queryBuilder.getCount();
  //     return {
  //       page: paginateDto.page,
  //       limit: allowedLimit,
  //       totalCount: currCount,
  //       data: currData,
  //     };
  //   } catch (error) {
  //     new HandleHttpExceptions({
  //       error,
  //       source: {
  //         service: CurrencyService.name,
  //         operator: this.paginate.name,
  //       },
  //       report: 'Failed to paginate Currencies',
  //     });
  //   }
  // }

  async findById(id: number): Promise<Currency> {
    return await this.currRepo.findOne({ where: { id } });
  }

  async findOneBy(query: FindOptionsWhere<Currency>): Promise<Currency> {
    return await this.currRepo.findOne({ where: query });
  }

  async findAll(): Promise<Currency[]> {
    return await this.currRepo.find({});
  }
}
