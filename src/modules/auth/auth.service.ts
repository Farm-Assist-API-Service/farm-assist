import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MESSAGE } from './enums';
import { JwtPayload } from 'src/core/interfaces';
import { isEmail } from 'src/core/utils';
import { UserService } from 'src/modules/user/user.service';
import { SigninUserDto } from './dto/SigninUserDto';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/CreateUserDto';
import { JWTDto } from './dto/JWTDto';
import { IAuthToken } from './interfaces/auth-token';
import { VerifyOTPDto } from './dto/VerifyOTPDto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      const payload = {
        identifier: newUser.email,
        sub: newUser.id,
      };

      const tokens = this.getTokens(payload);

      return {
        ...newUser,
        tokens,
      };
    } catch (error) {
      throw new HttpException(error?.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  async signIn(signinUserDto: SigninUserDto) {
    const isUser = await this.validateUserCredentials(signinUserDto);

    return this.getTokens({
      identifier: isUser.email,
      sub: isUser.id,
    });
  }

  async verifyOtp({ identifier, otp }: VerifyOTPDto) {
    try {
      const verified = 'Verification successful';
      const user = isEmail(identifier)
        ? await this.userService.getByEmail(identifier)
        : await this.userService.getByPhone(identifier);

      if (!user) {
        throw new NotFoundException(MESSAGE.userNotFound);
      }

      if (user.verifiedByEmail) {
        throw new ForbiddenException('User Verifed');
      }

      if (user.otp !== otp) {
        throw new ForbiddenException(MESSAGE.incorrectOtp);
      }

      user.verifiedByEmail = true;

      const updated = await this.userService.update(user.id, user);

      if (!updated.affected) {
        throw new BadRequestException(MESSAGE.somethingW);
      }

      return verified;
    } catch (error) {
      throw new HttpException(
        `OTP verification failed - ${error?.message || error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateUserCredentials({
    identifier,
    password,
  }: SigninUserDto): Promise<User> {
    try {
      console.log({ isEmail: isEmail(identifier) });
      const user = isEmail(identifier)
        ? await this.userService.getByEmail(identifier)
        : await this.userService.getByPhone(identifier);

      if (!user) {
        throw new UnauthorizedException(MESSAGE.wrongLogin);
      }

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        throw new UnauthorizedException(MESSAGE.wrongLogin);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        `User validation failed - ${error?.message || error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyJWT(token: string) {
    try {
      // const {} = await this.jwtService;
      const decoded: JwtPayload = await this.jwtService.verifyAsync(
        token,
        this.configService.get('JWT_SECRET'),
      );

      const { sub } = decoded;

      const user = await this.userService.getUserById(sub);

      if (!user) {
        throw new UnauthorizedException(MESSAGE.wrongLogin);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        `JWT verification failed - ${error?.message || error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getTokens(payload: JwtPayload): IAuthToken {
    const access = this.jwtService.sign({
      payload,
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    const refresh = this.issueRefreshToken(payload);
    return { access, refresh };
  }

  private issueRefreshToken(payload: JwtPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    return refreshToken;
  }

  async refreshAccessToken(refresh: string): Promise<IAuthToken> {
    try {
      const { sub, identifier }: JwtPayload = this.jwtService.verify(refresh);

      return {
        access: this.jwtService.sign({ identifier, sub }),
        refresh: this.issueRefreshToken({ identifier, sub }),
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid auth token - Token expired.');
      }
      throw error;
    }
  }
}
