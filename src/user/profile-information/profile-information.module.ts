import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileInformation } from './entities/profile-information.entity';
import { ProfileInformationService } from './profile-information.service';
import { ProfileInformationController } from './profile-information.controller';
import { User } from '../user.entity';
import { UserModule } from '../user.module';
import { ProfileReviewService } from './profile-review.service';
import { ProfileReview } from './entities/profile-review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileInformation, User, ProfileReview]),
  ],
  providers: [ProfileInformationService, ProfileReviewService],
  controllers: [ProfileInformationController],
})
export class ProfileInformationModule {}
