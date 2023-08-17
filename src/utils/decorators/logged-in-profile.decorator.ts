import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/config.env';

export const LoggedInProfile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization'].split('Bearer')[1].trim();
    const user = new JwtService({
      secret: env.JWT_SECRET,
    }).decode(token);
    return user['profile'];
  },
);
