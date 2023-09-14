import { ExecutionContext, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/config.env';
import { ProfileType } from 'src/user/profile-information/enums/profile-information.enum';

export const LoggedInProfile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization'].split('Bearer')[1].trim();
    const user = new JwtService({
      secret: env.JWT_SECRET,
    }).decode(token);

    const isReqular = user['profile'].profileType === ProfileType.REGULAR;
    if (isReqular) {
      throw new HttpException(
        `Regular profile cannot complete this operation. Switch to/create either ${Object.keys(
          ProfileType,
        )
          .toString()
          .replace(/,/gi, ' | ')} profile to proceed`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return user['profile'];
  },
);
