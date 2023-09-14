import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FarmCategory } from './entities/category.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { Category } from './interfaces';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { DataHelpers } from 'src/utils/helpers/data.helpers';

@Injectable()
export class CategoryService {
  private logger: Logger;

  constructor(
    // private readonly eventEmitter: EventEmitter2,
    @InjectRepository(FarmCategory)
    private readonly categoryRepo: Repository<FarmCategory>,
  ) {
    this.logger = new Logger(CategoryService.name);
  }

  async create(inputs: CreateCategoryDto): Promise<FarmCategory> {
    try {
      const exist = await this.findOneByName(inputs.name);
      if (exist) {
        throw new HttpException(
          'Category alreay exist with the name',
          HttpStatus.BAD_REQUEST,
        );
      }

      const mutCate: any = {
        name: inputs.name,
        description: inputs.description,
      };

      if (inputs.categoryId) {
        const parentCategory = await this.findOneById(inputs.categoryId);
        if (!parentCategory) {
          throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
        }

        if (parentCategory.categoryId) {
          throw new HttpException(
            'Sub category cannot become a parent category',
            HttpStatus.BAD_REQUEST,
          );
        }

        mutCate.categoryId = parentCategory.id;
        mutCate.category = parentCategory;
      }

      const newCate = this.categoryRepo.create(inputs);
      return this.categoryRepo.save(newCate);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: CategoryService.name,
          operator: this.create.name,
        },
        report: 'Error creating category',
      });
    }
  }

  async findOne({
    where,
    ...findOneOptions
  }: FindOneOptions): Promise<Category | null> {
    // This service will get a category and their subcategories
    const categories = await this.categoryRepo.find({});
    const category = categories.find((cate) => {
      return (
        ('id' in where && cate.id === where.id) ||
        ('name' in where && cate.name === where.name)
      );
    });

    if (category) {
      return {
        ...category,
        subCategories: categories.filter(
          (cate) => cate.categoryId === category.id,
        ),
      };
    }
    return null;
  }

  findOneById(id: number): Promise<Category> {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  findOneByName(name: string): Promise<Category> {
    return this.findOne({
      where: {
        name,
      },
    });
  }

  async getCategoriesByIds(ids: number[]): Promise<FarmCategory[]> {
    const categories = await this.categoryRepo.find({
      where: { isActive: true },
    });
    const cates: FarmCategory[] = [];

    const categoriesIds = new Set(categories.map((c) => c.id));

    ids.forEach((id) => {
      if (!categoriesIds.has(id)) {
        const error = `Category error: ${JSON.stringify(
          `Could not find category with the id: ${id}`,
        )}`;
        this.logger.error(error);
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      cates.push(categories.find((cate) => cate.id === id));
    });

    return cates;
  }
  // findSubcategoryByCategoryId() {
  //   // this service will return all the sub categories of that particular categoryId
  // }
  // async findAll(findManyOptions: FindManyOptions): Promise<Category[]> {
  //   const categories = await this.categoryRepo.find(findManyOptions); // This will collapse all category into a list, making both category & subcategory on one dimension
  //   return categories.map((category) => {
  //     return {
  //       ...category,
  //       subCategories: categories.filter(
  //         (cate) => cate.categoryId === category.id,
  //       ),
  //     };
  //   });
  // }

  async findAll({
    limit = 0,
    fromDate,
    toDate,
    day,
    userId,
    sortBy,
    page = 1,
    orderBy,
    status,
    query,
    field,
    value,
    groupByDate,
    active,
    group,
    ...paginateDto
  }: PaginateDto): Promise<any> {
    try {
      const skippedItems = (page - 1) * limit;
      const order = {
        createdAt: orderBy || 'DESC',
      };
      let categories: Category[] = [];
      let totalCount = 0;

      const findOptions: FindManyOptions<FarmCategory> = {
        take: limit,
        skip: skippedItems,
        order,
      };
      const whereOptions: any = {};
      if (active) {
        whereOptions['isActive'] = DataHelpers.stringToBool(active);
      }

      if (field && value) {
        whereOptions[field] = value;
      }
      findOptions.where = whereOptions;
      const [data, count] = await this.categoryRepo.findAndCount(findOptions);
      categories = data.map((category) => {
        return {
          ...category,
          subCategories: data.filter((cate) => cate.categoryId === category.id),
        };
      });

      if (group && DataHelpers.stringToBool(group) === true) {
        categories = categories.filter((cate) => !cate.categoryId);
      }

      totalCount = count;

      return {
        page,
        limit,
        totalCount,
        data: categories,
      };
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: CategoryService.name,
          operator: this.findAll.name,
        },
        report: 'Error fetching categories',
      });
    }
  }
}