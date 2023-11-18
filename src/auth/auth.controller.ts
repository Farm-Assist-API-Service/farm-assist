import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Req,
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
import { Request } from 'express';
import { FarmAssistAppointmentProviders } from 'src/appointment/enums/appointment-providers.enum';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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

  @Get('callback')
  callback(@Req() request: Request, @Query('code') code: string) {
    console.log({ code });

    const provider = FarmAssistAppointmentProviders.GOOGLE_SERVICE;
    this.authService.oauthCallback(provider, code);
  }

  @Get('oauth-url')
  getOauthURL(@Query('provider') provider: string) {
    if (!(provider in FarmAssistAppointmentProviders)) {
      throw new HttpException(
        `Invalid provider. ${Object.keys(FarmAssistAppointmentProviders)
          .toString()
          .replace(/\,/gi, ' | ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.getOauthURL(
      FarmAssistAppointmentProviders[provider],
    );
  }

  @Patch('request-password-reset')
  requestPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.requestPasswordReset(resetPasswordDto);
  }

  // @Patch('password-reset')
  // requestPasswordReset(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.authService.requestPasswordReset(resetPasswordDto);
  // }
}
