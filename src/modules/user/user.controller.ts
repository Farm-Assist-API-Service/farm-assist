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
import { CreateUserDto } from './dto/CreateUserDto';
import { UserService } from './user.service';
import { AllowedRoles } from '../auth/auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('new')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      ...data,
    };
  }
}
