import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { E_API_ERR, JwtPayload } from 'src/core/schemas';
import { isEmail } from 'src/core/utils';
import { UserService } from 'src/modules/user/user.service';
import { LoginUserDto } from '../auth/auth.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUserCredentials(
    identifier: string,
    password: string,
  ): Promise<User> {
    try {
      const user = isEmail(identifier)
        ? await this.userService.getUserByEmail(identifier)
        : await this.userService.getUserByPhone(identifier);

      if (!user) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }
      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async generateJWT({ identifier, password }: LoginUserDto) {
    try {
      const isValidUser = await this.validateUserCredentials(
        identifier,
        password,
      );

      const payload = {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        email: isValidUser.email,
        // sub: isValidUser.id,
      };

      return this.jwtTokenService.sign(payload);
    } catch (error) {
      throw error;
    }
  }

  async verifyJWT(token: string) {
    try {
      const decoded: JwtPayload = await this.jwtTokenService.verifyAsync(
        token,
        this.configService.get('JWT_SECRET'),
      );

      const { phone, sub } = decoded;
      const user = await this.userService.getUserByPhone(phone);

      if (!user) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
