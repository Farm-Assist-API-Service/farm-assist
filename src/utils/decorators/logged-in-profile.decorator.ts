import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/config.env';
import { ProfileType } from 'src/user/profile-information/enums/profile-information.enum';
import { EnumHelpers } from '../helpers/Enum-helpers';

export const LoggedInProfile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization'].split('Bearer')[1].trim();
    const user = new JwtService({
      secret: env.JWT_SECRET,
    }).decode(token);

    if (!user['profile'] || !user['profile']?.profileType) {
      throw new HttpException(
        'Sorry, you have no profile',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isReqular = user['profile'].profileType === ProfileType.REGULAR;
    if (isReqular) {
      throw new HttpException(
        `Regular profile cannot complete this operation. Switch to/create either ${EnumHelpers.enumToPlainText(
          ProfileType,
        )} profile to proceed`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return user['profile'];
  },
);
