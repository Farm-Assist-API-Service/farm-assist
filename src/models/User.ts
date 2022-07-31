import { PA } from '../interfaces';
import Model from './Model';

class User extends Model {

    create(entity: object): Promise<object> {
        return Promise.resolve({});
    }

    update(field: object): Promise<object> {
        return Promise.resolve({});
    }

    delete(id: string): Promise<object> {
        return Promise.resolve({});
    }

    get(id: string): Promise<object> {
        return Promise.resolve({});
    }

    get getAll(): PA {
        return Promise.resolve([]);
    }

}

export default User;