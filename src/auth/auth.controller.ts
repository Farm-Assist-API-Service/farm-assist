import {
  Body,
  Controller,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { AuthService } from './auth.service';
import { SignInInput } from './dtos/sign-in-input.dto';
import { SignUpInput } from './dtos/sign-up.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';

@Controller('auth')
@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Put('signin')
  signIn(@Body() signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Put('verify-account')
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto);
  }
}
