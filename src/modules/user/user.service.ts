import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { E_API_ERR, E_USER_ROLE } from 'src/core/schemas';
import { ADMIN_INFO } from 'src/core/constants';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  private get getAdminInfo() {
    if (
      !ADMIN_INFO.firstName ||
      !ADMIN_INFO.middleName ||
      !ADMIN_INFO.lastName ||
      !ADMIN_INFO.email ||
      !ADMIN_INFO.phone ||
      !ADMIN_INFO.password ||
      !ADMIN_INFO.role
    ) {
      throw new Error(E_API_ERR.missingAdmin);
    }
    return { ...ADMIN_INFO };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const users = await this.getAllUsers();

      // Create Admin
      const findAdmin = (user) => user.role === E_USER_ROLE.ADMIN;
      const adminExist = users.find(findAdmin);

      if (!adminExist) {
        await User.create({ ...this.getAdminInfo }).save();
        this.logger.verbose('Admin created');
      }

      // Check for duplicates
      const { phone, email } = createUserDto;

      //TODO: Refactor me
      const findPhone = (user: User) => user.phone === phone;
      const phoneExist = users.find(findPhone);

      if (phoneExist) {
        throw new ConflictException(E_API_ERR.phoneExist);
      }

      const findEmail = (user: User) => user.email === email;
      const emailExist = users.find(findEmail);

      if (emailExist) {
        throw new ConflictException(E_API_ERR.emailExist);
      }

      const user = User.create({ ...createUserDto });

      await user.save();
      delete user.password;

      // Generate JWT
      const payload = {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        phone: user.phone,
        sub: user.id,
      };
      const access_token = this.jwtTokenService.sign(payload);

      return {
        user,
        access_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.findById(id);

      delete user.password;
      return user;
    } catch (error) {
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  protected async findById(id: string) {
    try {
      return await User.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  async getUserByPhone(phone: string) {
    try {
      return await User.findOne({
        where: { phone },
      });
    } catch (error) {
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await User.findOne({
        where: { email },
      });
    } catch (error) {
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  async getAllUsers() {
    return await User.find();
  }
}
