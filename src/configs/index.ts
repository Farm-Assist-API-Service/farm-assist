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
    httpMethods: Array<string>;
    databaseURI: any; 
    entities: string[];
    services: string[];
    permissions: object;
    roles: object;
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
    allowedURL: ['http://localhost:3000'],
    entities: ['user', 'farm'],
    httpMethods: ["GET","POST","DELETE", "PUT"],
    databaseURI: process.env.DATABASE_URL as string,
    apiPath: process.env.API_PATH as string,
    services: [
        'user',
        'farm',
        'transaction',  // Users transactions
        'notification', // App notifications
        'reminder', // Farmer's assist
        'contents', // App contents
        'queued_events', // Events Queue ::6
        ''
    ],
    permissions: {
        farmer: [
            'read:user',
            'read:transaction',
            'update:user',
            'write:farm',
            'read:farm',
            'update:farm',
            'delete:farm',
        ],
        buyer: [
            'read:user',
            'read:transaction',
            'read:notification',
            'write:transaction',
            'update:user',
            'read:farm',
            'read:farm:all',
        ],
        admin: [
            '*'
        ]
    },
    roles: {
        ADMIN: {
            code: 101,
            name: 'admin'
        },
        FARMER: {
            code: 303,
            name: 'farmer',
        },
        BUYER: {
            code: 202,
            name: 'buyer',
        },
    },
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