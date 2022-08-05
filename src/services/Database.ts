// MongoDB Instance
import { APP_VAR } from "../configs";
import { IDBDriver, PA, PO, IDB, User, FindByEmail } from "../interfaces"; 

class Database implements IDB {

    private static connection: any;

    static initiate(database: IDBDriver) {
        return new Promise((resolve, reject) => {
            this.connection = database
                .createConnection()
                .then(connection => {
                    console.log('Database connected');
                    
                    return resolve(connection)
                })
                .catch(e => reject(e));
        });
    }

    public async insert<T>(data: T): Promise<T> {
        console.log('insert data is working', {data});
        try {
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findByEmail(field: FindByEmail): Promise<User | null> {
        try {
            console.log('findByEmail is working', {field});
            
            return Promise.resolve(null);
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export default Database;