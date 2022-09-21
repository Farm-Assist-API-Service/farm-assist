// Exports software configurations
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, '../../.env') });
// MongoDB configuration
export const mongoDBVARIABLES = {}

// Web3 configuration
export const web3VARIABLES = {}

// App configuration
export const APP_VAR: {
    env_mode: string;
    serverPort: number;
    allowedURL: Array<string>;
    databaseURI: any; 
    entities: string[];
    apiPath: string;
    jwt: {
        exp: string;
        secret: string;
    },
    hashing: {
        salt: number
    },
    OAuth: {
        clientID: string;
        authSecret: string;
        issuerBaseURL: string;
    }
} = {
    env_mode: process.env.NODE_ENV || 'development',
    serverPort: 3000,
    allowedURL: [''],
    entities: ['user', 'farm'],
    databaseURI: process.env.DATABASE_URL as string,
    apiPath: process.env.API_PATH as string,
    jwt: {
        exp: process.env.JWT_EXP as string,
        secret: process.env.JWT_SECRET as string
    },
    hashing: {
        salt: Number(process.env.HASHING_SALT)
    },
    OAuth: {
        clientID: process.env.CLIENT_ID as string,
        authSecret: process.env.AUTH_SECRET as string,
        issuerBaseURL: process.env.ISSUER_BASE_URL as string,
    }
}

// 