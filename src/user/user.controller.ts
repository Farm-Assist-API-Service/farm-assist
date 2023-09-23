import { Body, Controller, Patch, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { UserService } from './user.service';
import { VerifyUserInformationInput } from './dtos/verify-user-information';

@Controller('users')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('verify')
  verifyUserInformation(
    @Body() verifyUserInformationInput: VerifyUserInformationInput,
  ) {
    return this.userService.verifyUserInformation(verifyUserInformationInput);
  }
}
