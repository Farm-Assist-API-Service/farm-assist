import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { ROLE } from './enums';

export const AllowedRoles = (...roles: ROLE[]) => SetMetadata('roles', roles);

export const LoggedInUser = createParamDecorator((data, req) => {
  return req;
});
