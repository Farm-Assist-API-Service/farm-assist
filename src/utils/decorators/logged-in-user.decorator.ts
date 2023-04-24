import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const LoggedInUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    return data ? user?.[data] : user;
  },
);
