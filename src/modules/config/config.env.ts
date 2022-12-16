import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

type NODE_ENV = 'development' | 'production' | 'test';
type TYPEORM_TYPE = 'auto' | 'sqlite' | 'postgres';

export class EnvConfig {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: NODE_ENV;

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

  @IsBoolean()
  SKIP_AUTH: boolean;

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

  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  TWILIO_FROM_NUMBER: string;

  @IsBoolean()
  USE_INVITES_LIMIT: boolean;

  @IsNumber()
  INVITES_LIMIT: number;

  @IsNumber()
  INVITE_POINTS: number;

  @IsBoolean()
  SEND_WEEKLY_INSIGHTS: boolean;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  static getDefaultObject(): EnvConfig {
    const obj = new EnvConfig();
    obj.NODE_ENV = 'development';
    obj.PORT = 3000;
    obj.TYPEORM_TYPE = 'auto';
    obj.TYPEORM_HOST = 'localhost';
    obj.TYPEORM_USERNAME = 'postgres';
    obj.TYPEORM_PASSWORD = 'Alabi@0501';
    obj.TYPEORM_DATABASE = 'etap';
    obj.TYPEORM_PORT = 5432;
    obj.TYPEORM_LOGGING = true;
    obj.HEALTH_CHECK_DATABASE_TIMEOUT_MS = 3000;
    obj.JWT_SECRET = '';
    obj.JWT_EXPIRES_IN = 86400;
    obj.SKIP_AUTH = false;
    obj.AWS_REGION = 'us-west-2';
    obj.FIREBASE_PROJECT_ID = 'etap-d0f52';
    obj.FIREBASE_CLIENT_EMAIL =
      'firebase-adminsdk-sc54b@etap-d0f52.iam.gserviceaccount.com';
    obj.FIREBASE_STORAGE_BUCKET = 'e-tap-4e283.appspot.com';
    obj.TWILIO_ACCOUNT_SID = '';
    obj.TWILIO_AUTH_TOKEN = '';
    obj.TWILIO_FROM_NUMBER = '';
    obj.USE_INVITES_LIMIT = true;
    obj.INVITES_LIMIT = 5;
    obj.INVITE_POINTS = 50;
    obj.SEND_WEEKLY_INSIGHTS = true;
    obj.REDIS_HOST = 'localhost';
    obj.REDIS_PORT = 6379;
    return obj;
  }
}
