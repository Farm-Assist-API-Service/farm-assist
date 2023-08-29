import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindManyOptions, getRepository, Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserService } from '../user.service';
import { CreateProfileInformationInput } from './dtos/create-profile-information.input';
import { UpdateProfileInformationInput } from './dtos/update-profile-information.input';
import { ProfileInformation } from './entities/profile-information.entity';
import { ProfileType } from './enums/profile-information.enum';

@Injectable()
export class ProfileInformationService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(ProfileInformation)
    private readonly profileRepo: Repository<ProfileInformation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    this.logger = new Logger(ProfileInformationService.name);
  }
  async create(
    user: User,
    createProfileInformationInput?: CreateProfileInformationInput,
  ): Promise<ProfileInformation> {
    try {
      const profiles = await this.profileRepo.find({});
      const phoneExist = profiles.find(
        (profile) => profile.phone === createProfileInformationInput.phone,
      );

      const _user = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ['profileInformation'],
      });

      const defaultProfile = await _user.profileInformation.find(
        (each) => each.profileType === ProfileType.REGULAR,
      );

      if (defaultProfile) {
        this.logger.log(`Deleting regular profile for ${user.email}!!`);
        await this.deleteProfile(defaultProfile);
      }

      const exist = _user.profileInformation.find(
        (profile) =>
          profile.profileType ===
          ProfileType[createProfileInformationInput.profileType.toUpperCase()],
      );

      if (exist) {
        throw new HttpException(
          'Profile already exist on this account',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (phoneExist) {
        throw new HttpException(
          'Sorry. Phone number not available',
          HttpStatus.BAD_REQUEST,
        );
      }

      let profile = this.profileRepo.create({
        user: _user,
        regionId: user.region.id,
        ...createProfileInformationInput,
      });
      profile = { ...profile, ...createProfileInformationInput };

      return this.profileRepo.save(profile);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileInformationService.name,
          operator: this.create.name,
        },
        report: 'Failed to create user profile',
      });
    }
  }

  async getMyProfile(
    user: User,
    type: ProfileType | null,
  ): Promise<ProfileInformation> {
    try {
      const _user = await this.userRepo.findOne({
        where: {
          id: user.id,
        },
        relations: ['profileInformation'],
      });

      const profiles = _user.profileInformation;

      if (!profiles.length) {
        throw new HttpException(
          'Sorry, you have no profile',
          HttpStatus.BAD_REQUEST,
        );
      }

      const profile = !type
        ? profiles[0]
        : profiles.find((profile) => profile.profileType === type);

      return profile || null;
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileInformationService.name,
          operator: this.getMyProfile.name,
        },
        report: 'Error getting your profile',
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
    regionId,
    profileType,
    ...paginateDto
  }: PaginateDto): Promise<any> {
    try {
      const skippedItems = (page - 1) * limit;
      const order = {
        createdAt: orderBy || 'DESC',
      };
      let profiles = [];
      let totalCount = 0;

      const findOptions: FindManyOptions<ProfileInformation> = {
        take: limit,
        skip: skippedItems,
        order,
        relations: ['reviews'],
      };
      const whereOptions: any = {};
      if (regionId) {
        whereOptions['regionId'] = +regionId;
      }
      if (status) {
        whereOptions['status'] = status;
      }
      if (profileType && !ProfileType[profileType.toUpperCase()]) {
        throw new HttpException('Invalid profileType', HttpStatus.BAD_REQUEST);
      } else {
        whereOptions['profileType'] = profileType;
      }
      if (field && value) {
        whereOptions[field] = value;
      }
      findOptions.where = whereOptions;
      const [data, count] = await this.profileRepo.findAndCount(findOptions);
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
          service: ProfileInformationService.name,
          operator: this.findAll.name,
        },
        report: 'Error fetching profiles',
      });
    }
  }

  async getProfilebyID(profileId: number): Promise<ProfileInformation> {
    try {
      return this.profileRepo.findOne({
        where: {
          id: profileId,
        },
      });
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileInformationService.name,
          operator: this.getProfilebyID.name,
        },
        report: 'Error finding profile',
      });
    }
  }

  async getProfilesByType(
    type: ProfileType | null,
  ): Promise<ProfileInformation[]> {
    try {
      return this.profileRepo.find({
        where: {
          profileType: type,
        },
      });
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileInformationService.name,
          operator: this.getProfilesByType.name,
        },
        report: 'Error fetching profiles',
      });
    }
  }

  async deleteProfile(profile: ProfileInformation): Promise<void> {
    try {
      this.profileRepo.remove(profile);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileInformationService.name,
          operator: this.deleteProfile.name,
        },
        report: 'Error deleting profile',
      });
    }
  }

  async updateProfile(
    profileId: number,
    { profileType, ...inputs }: UpdateProfileInformationInput,
  ) {
    try {
      const profiles = await this.profileRepo.find({});
      if (inputs.phone && profiles.find((p) => p.phone === inputs.phone)) {
        throw new HttpException(
          'Phone not available',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const profile = profiles.find((p) => p.id === profileId);

      if (!profile) {
        throw new HttpException('Invalid profile', HttpStatus.BAD_REQUEST);
      }
      Object.assign(profile, { ...inputs });
      const udpate = await this.profileRepo.save(profile);
      return udpate;
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: ProfileInformationService.name,
          operator: this.updateProfile.name,
        },
        report: 'Error updating profile',
      });
    }
  }
}
