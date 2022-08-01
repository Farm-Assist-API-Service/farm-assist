// Exports software configurations
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, '../.env') });
// MongoDB configuration
export const mongoDBVARIABLES = {}

// Web3 configuration
export const web3VARIABLES = {}

// App configuration
export const APP_VAR: {
    serverPort: number;
    allowedURL: Array<string>;
    databaseURI: any; 
} = {
    serverPort: 3000,
    allowedURL: [''],
    databaseURI: process.env.DATABASE_URI
}

console.log(APP_VAR)

// 