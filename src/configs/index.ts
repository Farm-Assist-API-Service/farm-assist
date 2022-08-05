import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, '../.env') });


// MongoDB configuration
export const databases: {
    mongoURI: string | undefined;
} = {
    mongoURI: process.env.MONGO_DATABASE_REMOTE_URI || process.env.MONGO_DATABASE_LOCAL_URI
}

// Web3 configuration
export const web3VARIABLES = {}

// App configuration
export const APP_VAR: {
    serverPort: number;
    allowedOrigins: Array<string>;
    httpMethods: Array<string>;
    tokenSecret: string;
    tokenExpiry: number;
    apiRoot: string;
} = {
    serverPort: Number(process.env.SERVER_PORT) || 7000,
    allowedOrigins: ['http://localhost:3000'],
    httpMethods: ["GET","POST"],
    tokenSecret: process.env.JWT_TOKEN_SECRET as string,
    tokenExpiry: Number(process.env.JWT_TOKEN_EXPIRY),
    apiRoot: process.env.APP_API_ROOT as string
}

// 
