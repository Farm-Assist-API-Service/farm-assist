import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from 'src/config/config.service';
import { GeneratorService } from 'src/file/services/generator.service';
import { Region } from 'src/region/entities/region.entity';
import { RegionService } from 'src/region/region.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
// import { JwtService } from '@nestjs/jwt';
import {
  compareHashedKey,
  comparePassword,
  encryptPassword,
  generateHash,
} from 'src/utils/helpers/encrypt';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { GetContactID, UserHelpers } from 'src/utils/helpers/user';
import { Repository } from 'typeorm';
import { ConfirmPasswordResetDto } from './dtos/confirm-password-reset.dto';
import { ResetPasswordConfirmDto } from './dtos/reset-password-confirm.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignInInput } from './dtos/sign-in-input.dto';
import { SignInResult } from './dtos/sign-in-result.dto';
import { SignUpInput } from './dtos/sign-up.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { VerifyOtpDto } from './dtos/verify-otp-dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { UserRoles } from 'src/core/enums/roles.enum';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { ProfileType } from 'src/user/profile-information/enums/profile-information.enum';
import { EmailEngineFactory } from 'src/notification/email/factory';
import { EmailEngines } from 'src/notification/enums/email-engines.enum';
import { EmailSource } from 'src/notification/enums/email-source.enum';
import { otpTemplate } from 'src/view/emails/otp';
import { FarmAssistAppointmentProviders } from 'src/appointment/enums/appointment-providers.enum';
import { FsService } from 'src/file/services/fs.service';
import { GoogleService } from 'src/appointment/providers/google.service';

export type Login = { email: string; phone?: string; password: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ProfileInformation)
    private readonly profileRepo: Repository<ProfileInformation>,
    // @InjectRepository(Region) private readonly regionRepo: Repository<Region>,
    // private readonly jwtService: JwtService,
    private readonly genService: GeneratorService,
    private readonly configService: ConfigService,
    private readonly regionService: RegionService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailEngineFactory,
    private readonly fsService: FsService,
    private readonly googleService: GoogleService,
  ) {}

  private getContactID(identifier: string): GetContactID {
    try {
      return UserHelpers.ContactInformation.getContactId(identifier);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

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
      const { password, ...rest } = signUpInput;
      const hashedPassword = AuthService.encryptPassword(password);
      const userInput = this.userRepo.create({
        region,
        password: hashedPassword,
        otp: generateOTP,
        emailAlias: this.getEmailAlias(signUpInput.email),
        source: signUpInput.source,
        ...rest,
      });
      const newUser = await this.userRepo.save(userInput);

      // const defaultProfile = this.profileRepo.create({
      //   profileType: ProfileType.REGULAR,
      //   user: newUser,
      //   userId: newUser.id,
      // });

      // await this.profileRepo.save(defaultProfile);
      await this.emailService
        .findOne(EmailEngines.NODE_MAILER)
        .sendOTPMail(newUser);
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

  async signIn(signInInput: SignInInput): Promise<SignInResult> {
    try {
      let user: User, profile: ProfileInformation;
      const ContactID = UserHelpers.ContactInformation.getContactId(
        signInInput.identifier,
      );

      try {
        if (signInInput.profileType) {
          user = signInInput.deviceId
            ? await this.userRepo
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profileInformation', 'profile')
                .leftJoinAndSelect('user.invite', 'invite')
                .where(`profile.deviceId = '${signInInput.deviceId}'`)
                .andWhere(`profile.profileType = '${signInInput.profileType}'`)
                .getOne()
            : await this.userRepo
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.profileInformation', 'profile')
                .leftJoinAndSelect('user.invite', 'invite')
                .where(ContactID)
                .andWhere(`profile.profileType = '${signInInput.profileType}'`)
                .getOne();
        } else {
          user = await this.userRepo
            .createQueryBuilder('user')
            .where(ContactID)
            .getOne();
        }
      } catch (error) {
        throw new HandleHttpExceptions({
          error,
          source: {
            service: AuthService.name,
            operator: this.signIn.name,
          },
          report: 'Error Finding User',
        });
      }

      if (!user) {
        throw new HttpException(
          'Incorrect credentials',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isPassword = await comparePassword(
        signInInput.password,
        user.password,
      );

      if (!isPassword) {
        throw new HttpException(
          'Incorrect credentials',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user.otpVerified) {
        throw new HttpException(
          'Sorry. Account Not Verified. An OTP was sent to your email',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      if (!user.isActive) {
        throw new HttpException(
          'Sorry. Your account was disabled. kindly contact customer support',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const tokenPayload: any = {
        ...ContactID,
        id: user.id,
        role: user.role,
      };
      // const refreshToken = this.issueRefreshToken(payload);
      if (signInInput.profileType) {
        profile = user.profileInformation.find(
          (each) =>
            each.profileType ===
            ProfileType[signInInput.profileType.toUpperCase()],
        );
        tokenPayload['profile'] = profile;
      }

      // Get Auth token
      const token = await this.generateToken(tokenPayload);

      const output: any = {
        user: this.filter(user, ['password']),
      };

      Object.assign(output, {
        profileType: profile ? signInInput.profileType : null,
        token,
        refreshToken: '', // TODO: Refreh token
      });

      return output;
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: AuthService.name,
          operator: this.signIn.name,
        },
        report: 'Failed to authenticate user',
      });
    }
  }

  private static encryptPassword(password): string {
    return encryptPassword(password);
  }

  async generateToken(payload: Partial<User>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async validateUser(payload: Login): Promise<User | null> {
    const identifier = UserHelpers.ContactInformation.getContactId(
      payload.email || payload.phone,
    );
    return await this.userService.findOne({
      where: identifier,
    });
  }

  // private issueRefreshToken(payload: JwtPayload): string {
  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: this.config.env.JWT_SECRET,
  //     expiresIn: 2592000 * 6, // ~6 months
  //   });

  //   return refreshToken;
  // }

  // async refreshAccessToken(refresh: string): Promise<AuthTokenDto> {
  //   try {
  //     const { id, firstname, lastname, email } =
  //       this.jwtService.verify(refresh);

  //     return {
  //       access: this.jwtService.sign({ id, firstname, lastname, email }),
  //       refresh: this.issueRefreshToken({ id, firstname, lastname, email }),
  //     };
  //   } catch (error) {
  //     if (error.name === 'TokenExpiredError') {
  //       throw new UnauthorizedException('Invalid auth token - Token expired.');
  //     }
  //     throw error;
  //   }
  // }

  async resetUserPassword(payload: ResetPasswordDto): Promise<void> {
    let user = await this.userRepo.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new HttpException('Invalid Email', HttpStatus.BAD_REQUEST);
    }

    // const otpResponse: SendOtpResponse = await this.smsService.sendOtp({
    //   from: this.config.env.TWILIO_FROM_NUMBER,
    //   to: user.profileInformation.phoneNumber,
    //   messageText: `Use this pin to confirm your password reset - < 1234 >`,
    // });

    // generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user = await this.userRepo.save(user);

    // send user an OTP via sms
    // await this.smsService.sendMessage({
    //   body: `Use this One Time Password to complete your action - ${otp}`,
    //   from: this.config.env.TWILIO_FROM_NUMBER,
    //   to: user.profileInformation.phoneNumber,
    // });

    // await this.emailService.sendResetPasswordMail(user);
  }

  async resetUserPasswordConfirm(
    payload: ResetPasswordConfirmDto,
  ): Promise<void> {
    const user = await this.userRepo.findOne({
      where: {
        otp: payload.otp,
        email: payload.email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    const newPassword = AuthService.encryptPassword(payload.password);

    user.password = newPassword;
    await this.userRepo.save(user);
  }

  async verifyOtp(payload: VerifyOtpDto): Promise<void> {
    const user = await this.userRepo.findOne({
      where: {
        otp: payload.otp,
        email: payload.email,
      },
    });
    if (!user) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
  }

  async confirmPasswordReset(payload: ConfirmPasswordResetDto): Promise<void> {
    const user = await this.userRepo.findOne({
      where: {
        email: payload.email,
        otp: payload.otp,
      },
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    user.password = AuthService.encryptPassword(payload.password);
    await this.userRepo.save(user);
  }

  async verifyAccount(payload: VerifyAccountDto): Promise<void> {
    const identifier = this.getContactID(payload.identifier);
    await this.userService.verifyUserAccount(identifier, payload.otp);

    // Send Account confirmation mail
    // this.emailService.sendWelcomeMail(user);
  }

  protected getEmailAlias(email: string): string {
    return `${email.split('@')[0]}@${
      this.configService.env.APP_EMAIL.split('@')[1]
    }`;
  }

  private filter(
    user: User,
    propertiesToRemove: Array<keyof User>,
  ): Partial<User> {
    propertiesToRemove.forEach((property) => delete user[property]);
    return user;
  }

  // private static encryptPassword(password): string {
  //   const saltRounds = 10;
  //   const salt = bcrypt.genSaltSync(saltRounds);
  //   return bcrypt.hashSync(password, salt);
  // }

  async getOauthURL(provider: FarmAssistAppointmentProviders): Promise<string> {
    try {
      if (FarmAssistAppointmentProviders.GOOGLE_SERVICE === provider) {
        return this.googleService.getAuthURL;
      }

      // Agora
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: AuthService.name,
          operator: this.getOauthURL.name,
        },
        report: `Failed to get ${provider} AUTHORIZATION URL`,
      });
    }
  }

  async oauthCallback(
    provider: FarmAssistAppointmentProviders,
    code: string,
  ): Promise<void> {
    try {
      if (FarmAssistAppointmentProviders.GOOGLE_SERVICE === provider) {
        await this.googleService.setAuthCode(code);
      }
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: AuthService.name,
          operator: this.oauthCallback.name,
        },
        report: `Failed to set ${provider} AUTHORIZATION CODE`,
      });
    }
  }
}
