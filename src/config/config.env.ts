import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { config } from 'dotenv';
import { plainToClass } from 'class-transformer';

type NODE_ENV = 'development' | 'production' | 'test' | 'staging';
type MAIL_PROVIDERS = 'gmail';
type TYPEORM_TYPE = 'auto' | 'sqlite' | 'postgres';

class EnvConfig {
  @IsIn(['development', 'production', 'test', 'staging'])
  NODE_ENV: NODE_ENV;

  @IsString()
  APP_EMAIL: string;

  @IsString()
  APP_NAME: string;

  @IsNumber()
  PORT: number;

  @IsIn(['auto', 'sqlite', 'postgres'])
  TYPEORM_TYPE: TYPEORM_TYPE;

  @IsString()
  TYPEORM_HOST: string;

  @IsString()
  TYPEORM_USERNAME: string;

  @IsString()
  TYPEORM_PASSWORD: string;

  @IsString()
  TYPEORM_DATABASE: string;

  @IsNumber()
  TYPEORM_PORT: number;

  @IsBoolean()
  TYPEORM_LOGGING: boolean;

  @IsNumber()
  HEALTH_CHECK_DATABASE_TIMEOUT_MS: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRES_IN: number;

  @IsString()
  PAYSTACK_BASE_URL: string;

  @IsString()
  PAYSTACK_SECRET_KEY: string;

  @IsString()
  AWS_REGION: string;

  @IsString()
  AWS_ACCESS_KEY: string;

  @IsString()
  AWS_SECRET_KEY: string;

  @IsString()
  FIREBASE_PROJECT_ID: string;

  @IsString()
  FIREBASE_PRIVATE_KEY: string;

  @IsString()
  FIREBASE_CLIENT_EMAIL: string;

  @IsString()
  FIREBASE_STORAGE_BUCKET: string;

  // AUTH
  @IsBoolean()
  USE_OTP_VERIFICATION: boolean;

  @IsBoolean()
  SKIP_AUTH: boolean;

  @IsString()
  NODE_MAILER_AUTH_USER: string;

  @IsString()
  NODE_MAILER_AUTH_PASS: string;

  @IsString()
  APP_BASEL_URL: string;

  // @IsIn(['gmail'])
  NODE_MAILER_SERVICE_PROVIDER: string;
  // NODE_MAILER_SERVICE_PROVIDER: MAIL_PROVIDERS;

  @IsString()
  RSA_PRIVATE_KEY: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_CLIENT_REDIRECT_URL: string;

  @IsString()
  AGORA_APP_CERTIFICATE: string;

  @IsString()
  AGORA_APP_ID: string;

  static getDefaultObject(): EnvConfig {
    const obj = new EnvConfig();
    obj.NODE_ENV = 'development';
    obj.APP_EMAIL = process.env.APP_EMAIL || 'farmassite@gmail.com';
    obj.APP_NAME = process.env.APP_NAME || 'Farm Assist';
    obj.PORT = 3000;
    obj.APP_BASEL_URL =
      process.env.APP_BASEL_URL || 'https://localhost:' + obj.PORT;
    obj.TYPEORM_TYPE = (process.env.TYPEORM_TYPE as TYPEORM_TYPE) || 'auto';
    obj.TYPEORM_HOST =
      process.env.TYPEORM_HOST ||
      'dpg-cpthua5ds78s73dvmt10-a.oregon-postgres.render.com';
    obj.TYPEORM_USERNAME =
      process.env.TYPEORM_USERNAME || 'farm_assist_hrzr_user';
    obj.TYPEORM_PASSWORD =
      process.env.TYPEORM_PASSWORD || 'mLfSX9oKbuAV4Hob5EyBlvdcsRGdty6B';
    obj.TYPEORM_DATABASE = process.env.TYPEORM_DATABASE || 'farm_assist_hrzr';
    obj.TYPEORM_PORT = +process.env.TYPEORM_PORT || 5432;
    obj.TYPEORM_LOGGING = true;
    obj.HEALTH_CHECK_DATABASE_TIMEOUT_MS = 3000;
    obj.JWT_SECRET = 'farm-assist-jwt-secret';
    obj.JWT_EXPIRES_IN = 86400;
    obj.PAYSTACK_BASE_URL = 'https://api.paystack.co';
    obj.PAYSTACK_SECRET_KEY = '';
    obj.AWS_REGION = '';
    obj.AWS_ACCESS_KEY = '';
    obj.AWS_SECRET_KEY = '';
    obj.FIREBASE_PROJECT_ID = '';
    obj.FIREBASE_PRIVATE_KEY = '';
    obj.FIREBASE_CLIENT_EMAIL = '';
    obj.FIREBASE_STORAGE_BUCKET = '';
    obj.USE_OTP_VERIFICATION = !!process.env.USE_OTP_VERIFICATION || true;
    obj.SKIP_AUTH = !!process.env.SKIP_AUTH || false;
    obj.NODE_MAILER_AUTH_USER =
      process.env.NODE_MAILER_AUTH_USER || 'farmassite@gmail.com';
    obj.NODE_MAILER_AUTH_PASS =
      process.env.NODE_MAILER_AUTH_PASS || 'cwxpwmbfnxbihnnv';
    obj.NODE_MAILER_SERVICE_PROVIDER =
      (process.env.NODE_MAILER_SERVICE_PROVIDER as MAIL_PROVIDERS) || 'gmail';
    obj.RSA_PRIVATE_KEY = `-----BEGIN OPENSSH PRIVATE KEY-----
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
-----END OPENSSH PRIVATE KEY-----
`;
    obj.GOOGLE_CLIENT_ID =
      process.env.GOOGLE_CLIENT_ID ||
      '191986046277-hi4u7dq4g1qun73djliaa2ge5rv10uqv.apps.googleusercontent.com';
    obj.GOOGLE_CLIENT_SECRET =
      process.env.GOOGLE_CLIENT_SECRET || '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';
    obj.GOOGLE_CLIENT_REDIRECT_URL =
      process.env.GOOGLE_CLIENT_REDIRECT_URL ||
      'http://localhost:3000/auth/callback';
    obj.AGORA_APP_ID =
      process.env.AGORA_APP_ID || 'a89d7c2dc59849ceb7ae86c9dc2c45f0';
    obj.AGORA_APP_CERTIFICATE =
      process.env.AGORA_APP_CERTIFICATE || '81a8d4aafb7d4858845d0ed630e40a51';

    return obj;
  }
}

config();

const env = plainToClass(
  EnvConfig,
  { ...EnvConfig.getDefaultObject(), ...process.env },
  { enableImplicitConversion: true },
);

const errors = validateSync(env, { whitelist: true });

if (errors.length > 0) {
  // eslint-disable-next-line no-console
  console.error(JSON.stringify(errors, undefined, '  '));
  throw new Error('Invalid env.');
}

export { EnvConfig, env };
