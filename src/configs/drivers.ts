
import { Schema, model, connect } from 'mongoose';
import { DriverError } from '../helpers/errors';
import { IDBDriver, PO } from '../interfaces';


export class Mongo implements IDBDriver {

    public URI: string;
    public name: string;
    protected conn: any;

    constructor() {
        this.name = "Mongo";
        this.URI = process.env.MONGO_DATABASE_REMOTE_URI || process.env.MONGO_DATABASE_LOCAL_URI || '';
    }

    async createConnection(): PO {
        try {
           this.conn = await connect(this.URI);           
           return Promise.resolve(this.conn);
        } catch (error) {
            return Promise.reject(error);
            // new DriverError(error);
        }
    }

}