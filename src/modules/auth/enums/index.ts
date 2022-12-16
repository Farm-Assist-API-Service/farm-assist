export enum MESSAGE {
  ERR_CODE_DUPLICATE = 'ERR:DUPLICATE',
  ERR_CODE_NOT_FOUND = 'ERR:NOT_FOUND',
  ERR_CODE_INCORRECT_LOGIN = 'ERR:INCORRECT_LOGIN',
  somethingW = 'Oops! Something went wrong',
  manyRequest = 'Too many attempts.',
  connectionErr = 'Unable to connect',
  noUser = 'No users',
  userNotFound = 'User not found',
  incorrectOtp = 'Incorrect OTP',
  notFound = 'Not found',
  unAuthorized = 'Access Denied to this resource!',
  wrongLogin = 'Incorrect login credentials',
  phoneExist = 'Sorry! This mobile number is already registered',
  emailExist = 'Sorry! This email address is already registered',
  unRecogPhone = 'Sorry! This mobile number is not valid',
  invalidData = 'Sorry! Request is not valid',
  unRecogEntity = 'Unrecognized entity',
  unProcessableData = 'Unprocessable data entry',
  farmNotFound = 'Farm not found',
  falsyAccessClaim = 'Unrecognized access claim. Try re-authorizing',
  missingAdmin = 'Please set admin credentials in .env to proceed',
}

export enum ROLE {
  ADMIN = 'ADMIN',
  FARMER = 'FARMER',
}

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
