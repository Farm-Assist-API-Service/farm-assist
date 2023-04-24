import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { AuthService } from './auth.service';
import { SignInInput } from './dtos/sign-in-input.dto';
import { SignUpInput } from './dtos/sign-up.dto';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Post('signup')
  signIn(@Body() signInInput: SignInInput) {
    // return this.authService.signIn(signInInput);
  }
}
