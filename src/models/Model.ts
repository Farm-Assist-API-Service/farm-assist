import { IModel, PA, PO } from '../interfaces';

abstract class Model implements IModel {

    create(entity: object): PO {
        return Promise.resolve({});
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
