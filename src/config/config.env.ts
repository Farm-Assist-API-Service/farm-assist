import { IsBoolean, IsIn, IsNumber, IsString } from 'class-validator';

type NODE_ENV = 'development' | 'production' | 'test';
type TYPEORM_TYPE = 'auto' | 'sqlite' | 'postgres';

export class EnvConfig {
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

  static getDefaultObject(): EnvConfig {
    const obj = new EnvConfig();
    obj.NODE_ENV = 'development';
    obj.APP_EMAIL = 'admin@farmassist.com';
    obj.APP_NAME = 'Farm Assist serivce';
    obj.PORT = 3000;
    obj.TYPEORM_TYPE = 'auto';
    obj.TYPEORM_HOST = 'localhost';
    obj.TYPEORM_USERNAME = 'gu';
    obj.TYPEORM_PASSWORD = 'postgres';
    obj.TYPEORM_DATABASE = 'farm_assist';
    obj.TYPEORM_PORT = 5432;
    obj.TYPEORM_LOGGING = true;
    obj.HEALTH_CHECK_DATABASE_TIMEOUT_MS = 3000;
    obj.JWT_SECRET = '';
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
    return obj;
  }
}
