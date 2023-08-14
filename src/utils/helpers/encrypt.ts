import * as crypto from 'crypto';

import * as bcrypt from 'bcrypt';

const encrypt = (text: string): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(text, salt);
};

export const generateHash = (str: string, algorithm = 'sha512'): string =>
  crypto.createHash(algorithm).update(str).digest('hex');

export const compareHashedKey = async (
  input: string,
  compareWith: string,
): Promise<boolean> => {
  return bcrypt.compare(input, compareWith);
};
export default encrypt;

export const encryptPassword = (password): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password: string, hash: string): string =>
  bcrypt.compare(password, hash);
