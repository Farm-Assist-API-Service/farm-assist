import {
  Controller,
  Req,
  Post,
  Get,
  Body,
  Param,
  Request,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { E_USER_ROLE } from 'src/core/schemas';
// import { AuthGuard } from '../auth/auth.guard';
import { AllowedRoles } from '../auth/auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('new')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.usersService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        ...data,
      };
    } catch (error) {
      throw error;
    }
  }
}
