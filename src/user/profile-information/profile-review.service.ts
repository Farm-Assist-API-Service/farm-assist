import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateProfileReviewDto } from './dtos/create-profile-review';
import { ProfileReview } from './entities/profile-review.entity';
import { ProfileInformationService } from './profile-information.service';

@Injectable()
export class ProfileReviewService {
  constructor(
    @InjectRepository(ProfileReview)
    private readonly reviewRepo: Repository<ProfileReview>,
    private readonly profileInfoService: ProfileInformationService,
  ) {}

  async create(
    inputs: CreateProfileReviewDto,
    reviewBy: User,
  ): Promise<ProfileReview> {
    try {
      const profile = await this.profileInfoService.getProfilebyID(
        inputs.profileId,
      );

      if (!profile) {
        throw new HttpException(
          'Sorry. Profile does not exist anymore',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newReview = this.reviewRepo.create({
        ...inputs,
        profile,
        reviewBy,
        reviewById: reviewBy.id,
      });
      return this.reviewRepo.save(newReview);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileReviewService.name,
          operator: this.create.name,
        },
        report: 'Error creating review',
      });
    }
  }

  async findOne(opts: FindOneOptions<ProfileReview>): Promise<ProfileReview> {
    try {
      return this.reviewRepo.findOne(opts);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileReviewService.name,
          operator: this.findOne.name,
        },
        report: 'Error finding review',
      });
    }
  }

  async find(opts: FindManyOptions<ProfileReview>): Promise<ProfileReview[]> {
    try {
      return this.reviewRepo.find(opts);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileReviewService.name,
          operator: this.findAll.name,
        },
        report: 'Error finding reviews',
      });
    }
  }

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
    ...paginateDto
  }: PaginateDto): Promise<any> {
    try {
      const skippedItems = (page - 1) * limit;
      const order = {};
      if (sortBy) {
        order[sortBy] = orderBy || 'DESC';
      } else {
        // eslint-disable-next-line dot-notation
        order['id'] = 'DESC';
      }
      let profiles = [];
      let totalCount = 0;

      const findOptions: FindManyOptions<ProfileReview> = {
        take: limit,
        skip: skippedItems,
        order,
      };
      const whereOptions: any = {};
      if (field && value) {
        whereOptions[field] = value;
      }
      findOptions.where = whereOptions;
      const [data, count] = await this.reviewRepo.findAndCount(findOptions);
      profiles = data;
      totalCount = count;

      return {
        page,
        limit,
        totalCount,
        data: profiles,
      };
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileReviewService.name,
          operator: this.findAll.name,
        },
        report: 'Error fetching reviews',
      });
    }
  }
}
