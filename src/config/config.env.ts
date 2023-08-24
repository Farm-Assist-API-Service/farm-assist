import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { config } from 'dotenv';
import { plainToClass } from 'class-transformer';

type NODE_ENV = 'development' | 'production' | 'test';
type MAIL_PROVIDERS = 'gmail';
type TYPEORM_TYPE = 'auto' | 'sqlite' | 'postgres';

class EnvConfig {
  @IsIn(['development', 'production', 'test'])
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

  @IsIn(['gmail'])
  NODE_MAILER_SERVICE_PROVIDER: MAIL_PROVIDERS;

  static getDefaultObject(): EnvConfig {
    const obj = new EnvConfig();
    obj.NODE_ENV = 'development';
    obj.APP_EMAIL = 'admin@farmassist.com';
    obj.APP_NAME = 'Farm Assist serivce';
    obj.APP_BASEL_URL =
      process.env.APP_BASEL_URL || 'https://farm-assist-staging.up.railway.app';
    obj.PORT = 3000;
    obj.TYPEORM_TYPE = (process.env.TYPEORM_TYPE as TYPEORM_TYPE) || 'auto';
    obj.TYPEORM_HOST = process.env.TYPEORM_HOST || 'localhost';
    obj.TYPEORM_USERNAME = process.env.TYPEORM_USERNAME || 'gu';
    obj.TYPEORM_PASSWORD = process.env.TYPEORM_PASSWORD || 'postgres';
    obj.TYPEORM_DATABASE = process.env.TYPEORM_DATABASE || 'farm_assist';
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
    obj.NODE_MAILER_AUTH_USER = process.env.NODE_MAILER_AUTH_USER;
    obj.NODE_MAILER_AUTH_PASS = process.env.NODE_MAILER_AUTH_PASS;
    obj.NODE_MAILER_SERVICE_PROVIDER =
      (process.env.NODE_MAILER_SERVICE_PROVIDER as MAIL_PROVIDERS) || 'gmail';
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
