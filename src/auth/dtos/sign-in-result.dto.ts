import { User } from 'src/user/user.entity';

export class SignInResult extends User {
  readonly token: string;

  readonly refreshToken: string;
}
