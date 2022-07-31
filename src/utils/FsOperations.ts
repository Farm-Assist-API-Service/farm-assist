import '../configs'
import { IFSOperation } from '../interfaces';

// File system Instance
class FsOperations implements IFSOperation {
    private filePath: string = '';

    constructor() {
    }

    readFile(props: string[]): object[] {
        return []
    }

    writeFile(oject: object): Promise<string> {
        return Promise.resolve('');
    }
}

export default FsOperations;