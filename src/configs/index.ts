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
    serverPort: number;
    allowedURL: Array<string>;
    databaseURI: any; 
    entities: string[];
    apiPath: string;
    OAuth: {
        clientID: string;
        authSecret: string;
        issuerBaseURL: string;
    }
} = {
    serverPort: 3000,
    allowedURL: [''],
    entities: ['user', 'farm'],
    databaseURI: process.env.DATABASE_URL as string,
    apiPath: process.env.API_PATH as string,
    OAuth: {
        clientID: process.env.CLIENT_ID as string,
        authSecret: process.env.AUTH_SECRET as string,
        issuerBaseURL: process.env.ISSUER_BASE_URL as string,
    }
}

// 