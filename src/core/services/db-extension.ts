import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { Entity, EntityOptions, FindOptionsWhere } from 'typeorm';
import { PaginateDto } from '../dtos/paginate.dto';
import { PaginatedResponse } from '../interfaces/paginated-response';

type P = {
  entity: any;
};

export class DbExtension {
  // async paginate(
  //   option: P,
  //   paginateDto: PaginateDto,
  // ): Promise<PaginatedResponse> {
  //   try {
  //     const { sortBy, orderBy, page, limit, query } = paginateDto;
  //     const allowedLimit = Math.min(+limit, 40);
  //     const skippedItems = (page - 1) * allowedLimit;
  //     const queryBuilder = option.entity.createQueryBuilder('region');
  //     if (query) {
  //       const whereQuery = 'LOWER(region.name) like LOWER(:name)';
  //       const whereParams = { name: `%${query}%` };
  //       queryBuilder.where(whereQuery, whereParams);
  //     }
  //     queryBuilder.orderBy(`region.${sortBy || 'id'}`, orderBy || 'DESC');
  //     queryBuilder.skip(skippedItems).take(allowedLimit);
  //     const regionData = await queryBuilder.getMany();
  //     const regionCount = await queryBuilder.getCount();
  //     return {
  //       page: paginateDto.page,
  //       limit: allowedLimit,
  //       totalCount: regionCount,
  //       data: regionData,
  //     };
  //   } catch (error) {
  //     new HandleHttpExceptions({
  //       error,
  //       source: {
  //         service: DbExtension.name,
  //         operator: this.paginate.name,
  //       },
  //       report: 'Failed to paginate Regions',
  //     });
  //   }
  // }
}
