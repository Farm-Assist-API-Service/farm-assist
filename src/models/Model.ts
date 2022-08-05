import { IModel, PA, PO } from '../interfaces';
import { RequiredParameterError, InvalidPropertyError } from '../helpers/errors';

abstract class Model implements IModel {

    create(entity: object): PO {
        return new Promise((resolve, reject) => {
            const newEntity = Object.freeze(entity);
            resolve(newEntity);
        });
    }

    update(field: object): PO {
        return Promise.resolve({});
    }

    delete(id: string): PO {
        return Promise.resolve({});
    }

    get(id: string): PO {
        return Promise.resolve({});
    }

    get getAll(): PA {
        return Promise.resolve([]);
    }

}

export default Model;
