// MongoDB Instance
import { APP_VAR } from "../configs";
import { IDBDriver, PA, PO } from "../interfaces/interface"; 

class Database {

    private static connection: any;

    static initiate(database: IDBDriver) {
        return new Promise((resolve, reject) => {
            this.connection = database
                .createConnection()
                .then(connection => resolve(connection))
                .catch(e => reject(e));
        });
    }

}

export default Database;