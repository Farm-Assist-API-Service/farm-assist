import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { E_USER_ROLE } from '../../core/schemas';

export const AllowedRoles = (...roles: E_USER_ROLE[]) =>
  SetMetadata('roles', roles);

export const LoggedInUser = createParamDecorator((data, req) => {
  return req;
});
