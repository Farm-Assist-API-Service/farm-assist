import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileInformation } from './entities/profile-information.entity';
import { ProfileInformationService } from './profile-information.service';
import { ProfileInformationController } from './profile-information.controller';
import { User } from '../user.entity';
import { ProfileReviewService } from './profile-review.service';
import { ProfileReview } from './entities/profile-review.entity';
import { FarmModule } from 'src/farm/farm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileInformation, User, ProfileReview]),
    FarmModule,
  ],
  providers: [ProfileInformationService, ProfileReviewService],
  controllers: [ProfileInformationController],
  exports: [ProfileInformationService],
})
export class ProfileInformationModule {}
