import {
  Controller,
  Post,
  HttpStatus,
  Body,
  UseInterceptors,
  UseFilters,
  HttpCode,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/CreateUserDto';
import { SigninUserDto } from './dto/SigninUserDto';
import { AuthService } from './auth.service';
import { TransformInterceptor } from '../utils/interceptors/transform.interceptor';
import { HttpExceptionFilterFilter } from '../utils/filters/http-exception.filter/http-exception.filter.filter';
import { VerifyOTPDto } from './dto/VerifyOTPDto';

@UseFilters(HttpExceptionFilterFilter)
@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() signinUserDto: SigninUserDto) {
    const payload = {
      identifier: signinUserDto.identifier,
      password: signinUserDto.password,
    };
    return await this.authService.signIn(payload);
  }

  @Put('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() verifyOTPDto: VerifyOTPDto) {
    const payload = {
      identifier: verifyOTPDto.identifier,
      otp: verifyOTPDto.otp,
    };
    return await this.authService.verifyOtp(payload);
  }
}
