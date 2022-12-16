import {
  Injectable,
  NotFoundException,
  HttpException,
  ConflictException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Brackets,
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  IsNull,
  Like,
  MoreThan,
  Not,
  Repository,
  SelectQueryBuilder,
  getManager,
  UpdateResult,
  getRepository,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/CreateUserDto';
import { MESSAGE, ROLE } from './enums';
import { ADMIN_INFO } from 'src/core/constants';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
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
      throw new Error(MESSAGE.missingAdmin);
    }
    return { ...ADMIN_INFO };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser: any = { ...createUserDto };
      const users = await this.getAll();

      // Create Admin
      const findAdmin = (user) => user.role === ROLE.ADMIN;
      const adminExist = users.find(findAdmin);

      if (!adminExist) {
        await User.create({ ...this.getAdminInfo }).save();
        this.logger.verbose('Admin created');
      }

      // Check for duplicates
      const { phone, email } = newUser;

      //TODO: Refactor me
      const findPhone = (user: User) => user.phone === phone;
      const phoneExist = users.find(findPhone);

      if (phoneExist) {
        throw new ConflictException(MESSAGE.phoneExist);
      }

      const findEmail = (user: User) => user.email === email;
      const emailExist = users.find(findEmail);

      if (emailExist) {
        throw new ConflictException(`Sign Up failed - ${MESSAGE.emailExist}`);
      }

      // Add OTP
      newUser.otp = this.generateOTP;

      const user = User.create({ ...newUser });

      await user.save();
      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }

  private get generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async getUserById(id: number): Promise<User> {
    return await this.findById(id);
  }

  protected async findById(id: number): Promise<User> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async getByPhone(phone: string): Promise<User> {
    return await this.usersRepo.findOne({
      where: { phone },
    });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.usersRepo.findOne({
      where: { email },
    });
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepo.find();
  }

  async save(user: User): Promise<User> {
    return await this.usersRepo.save(user);
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    try {
      let user = await this.findById(id);
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      const userUpdateData = { ...user, ...updateData };
      user = await this.usersRepo.save(userUpdateData);
      return user;
    } catch (error) {
      Logger.error(`User Not Updated: ${JSON.stringify(error.message)}`);
      throw new HttpException(
        'User Not Updated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<UpdateResult> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      const userUpdateData = { ...user, ...updateData };
      console.log({ userUpdateData });
      return await this.usersRepo.update(id, userUpdateData);
    } catch (error) {
      Logger.error(`User Not Updated: ${JSON.stringify(error.message)}`);
      throw new HttpException(
        'User Not Updated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
