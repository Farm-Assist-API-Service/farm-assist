import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { GetContactID } from 'src/utils/helpers/user';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(inputs: User): Promise<User> {
    try {
      const newUser = this.userRepo.create({
        region: inputs.region,
        password: inputs.password,
        otp: inputs.otp,
        emailAlias: inputs.emailAlias,
        source: inputs.source,
        ...inputs,
      });
      return this.userRepo.save(newUser);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: UserService.name,
          operator: this.create.name,
        },
        report: 'Error creating user',
      });
    }
  }

  async findOne(inputs: FindOneOptions<User>): Promise<User> {
    try {
      return this.userRepo.findOne(inputs);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: UserService.name,
          operator: this.findOne.name,
        },
        report: 'Error finding user',
      });
    }
  }

  async find(input: FindManyOptions<User>): Promise<User[]> {
    try {
      return this.userRepo.find(input);
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: UserService.name,
          operator: this.find.name,
        },
        report: 'Error finding users',
      });
    }
  }

  // Update User
  async update(id: number, fields: Partial<User>): Promise<void> {
    await this.userRepo.update(id, fields);
  }

  async verifyUserAccount(
    identifier: GetContactID,
    otp: string,
  ): Promise<void> {
    try {
      const user = await this.findOne({ where: identifier });

      if (user && user?.otpVerified && user?.otp === otp) {
        throw new HttpException('Expired OTP', HttpStatus.BAD_REQUEST);
      }

      if (!user || user?.otpVerified || user?.otp !== otp) {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
      user.otpVerified = true;
      user.isActive = true;

      await this.userRepo.save(user);
    } catch (error) {
      throw new HandleHttpExceptions({
        error,
        source: {
          service: UserService.name,
          operator: this.verifyUserAccount.name,
        },
        report: 'Error Verifying User Account',
      });
    }
  }
}
