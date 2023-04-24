import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { GeneratorService } from 'src/generator/generator.service';
import { Region } from 'src/region/entities/region.entity';
import { RegionService } from 'src/region/region.service';
import { User } from 'src/user/user.entity';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { Repository } from 'typeorm';
import { SignInInput } from './dtos/sign-in-input.dto';
import { SignInResult } from './dtos/sign-in-result.dto';
import { SignUpInput } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    // @InjectRepository(Region) private readonly regionRepo: Repository<Region>,
    private readonly genService: GeneratorService,
    private readonly configService: ConfigService,
    private readonly regionService: RegionService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<any> {
    try {
      const { generateOTP } = this.genService;
      const region = await this.regionService.findOneBy({
        id: signUpInput.regionId,
      });

      if (!region) {
        throw new HttpException(
          'Service not available in user region',
          HttpStatus.BAD_REQUEST,
        );
      }

      const users = await this.userRepo.find({});
      const emailExist = users.find((user) => user.email === signUpInput.email);

      if (emailExist) {
        throw new HttpException('Email is not available', HttpStatus.CONFLICT);
      }

      if (
        signUpInput.phone &&
        users.find((user) => user.phone === signUpInput.phone)
      ) {
        throw new HttpException(
          'Phone number is not available',
          HttpStatus.CONFLICT,
        );
      }

      // TODO: Hash password
      const userInput = this.userRepo.create({
        region,
        otp: generateOTP,
        emailAlias: this.getEmailAlias(signUpInput.email),
        source: signUpInput.source,
        ...signUpInput,
      });

      const newUser = await this.userRepo.save(userInput);
      //TODO: Send Onboarding Email
      return newUser;
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: AuthService.name,
          operator: this.signUp.name,
        },
        report: 'Failed to register user',
      });
    }
  }

  // async signIn(signInInput: SignInInput): Promise<SignInResult> {
  //   const user = signInInput.deviceId
  //     ? await this.userRepo
  //         .createQueryBuilder('user')
  //         .leftJoinAndSelect('user.profileInformation', 'profile')
  //         .leftJoinAndSelect('user.invite', 'invite')
  //         .where(`profile.deviceId = '${signInInput.deviceId}'`)
  //         .getOne()
  //     : await this.userRepo
  //         .createQueryBuilder('user')
  //         .leftJoinAndSelect('user.invite', 'invite')
  //         .where(`LOWER(email) = '${signInInput.email?.toLowerCase()}'`)
  //         .getOne();

  //   if (!user) {
  //     return new SignInResult();
  //   }
  // }

  protected getEmailAlias(email: string): string {
    return `${email.split('@')[0]}@${
      this.configService.env.APP_EMAIL.split('@')[1]
    }`;
  }

  // private static encryptPassword(password): string {
  //   const saltRounds = 10;
  //   const salt = bcrypt.genSaltSync(saltRounds);
  //   return bcrypt.hashSync(password, salt);
  // }
}
