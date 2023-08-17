import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { LoggedInProfile } from 'src/utils/decorators/logged-in-profile.decorator';
import { LoggedInUser } from 'src/utils/decorators/logged-in-user.decorator';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { User } from '../user.entity';
import { CreateProfileInformationInput } from './dtos/create-profile-information.input';
import { CreateProfileReviewDto } from './dtos/create-profile-review';
import { UpdateProfileInformationInput } from './dtos/update-profile-information.input';
import { ProfileInformation } from './entities/profile-information.entity';
import { ProfileReview } from './entities/profile-review.entity';
import { ProfileType } from './enums/profile-information.enum';
import { ProfileInformationService } from './profile-information.service';
import { ProfileReviewService } from './profile-review.service';

@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class ProfileInformationController {
  constructor(
    private readonly profileInformationService: ProfileInformationService,
    private readonly profileReviewService: ProfileReviewService,
  ) {}

  @Post()
  create(
    @LoggedInUser() user: User,
    @Body() createProfileInformationInput: CreateProfileInformationInput,
  ): Promise<any> {
    return this.profileInformationService.create(
      user,
      createProfileInformationInput,
    );
  }

  @Get('me')
  getMyProfile(
    @LoggedInUser() user: User,
    @Query('type') type: ProfileType | null = null,
  ): Promise<any> {
    return this.profileInformationService.getMyProfile(user, type);
  }

  @Get()
  getProfiles(
    @Query() paginateDto: PaginateDto,
  ): Promise<ProfileInformation[]> {
    return this.profileInformationService.findAll(paginateDto);
  }

  @Get()
  getProfile(
    @Query('type') type: ProfileType | null = null,
  ): Promise<ProfileInformation[]> {
    return this.profileInformationService.getProfilesByType(type);
  }

  @Get('profileId ')
  getProfileById(
    @Param('profileId') profileId: number,
  ): Promise<ProfileInformation> {
    return this.profileInformationService.getProfilebyID(profileId);
  }

  @Post('reviews')
  createReview(
    @Body() createProfileReviewDto: CreateProfileReviewDto,
    @LoggedInUser() user: User,
  ): Promise<ProfileReview> {
    return this.profileReviewService.create(createProfileReviewDto, user);
  }

  @Get('reviews')
  getReviews(): Promise<ProfileReview[]> {
    return this.profileReviewService.findAll({});
  }

  @Get('reviews')
  getReview(
    @Query('reviewId', ParseIntPipe) reviewId: number,
  ): Promise<ProfileReview> {
    return this.profileReviewService.findOne({ where: { id: reviewId } });
  }

  @Put()
  updateProfile(
    @LoggedInProfile() profile: ProfileInformation,
    @Body()
    updateProfileInformationInput: UpdateProfileInformationInput,
  ) {
    return this.profileInformationService.updateProfile(
      profile.id,
      updateProfileInformationInput,
    );
  }
}
