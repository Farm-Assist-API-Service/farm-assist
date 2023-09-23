import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { VerifyProfileInformationInput } from './dtos/verify-profile-information';

@Controller('profiles')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class ProfileInformationControllerExtension {
  constructor(
    private readonly profileInformationService: ProfileInformationService,
  ) {}

  @Patch('verify')
  verifyProfileInformation(
    @Body() verifyProfileInformationInput: VerifyProfileInformationInput,
  ) {
    return this.profileInformationService.verifyProfileInformation(
      verifyProfileInformationInput,
    );
  }
}
