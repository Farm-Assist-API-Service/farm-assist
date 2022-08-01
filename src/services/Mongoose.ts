// MongoDB Instance
import { Schema, model, connect } from 'mongoose';
import { APP_VAR } from "../configs";

class Mongoose {

    create() {
        connect(APP_VAR.databaseURI);
    }
}

export default Mongoose;