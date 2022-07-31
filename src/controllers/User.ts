import Controller from './Controller';
import { UserModel } from '../models';
import { Request, Response, Next } from '../interfaces';

const user = new UserModel();

// User controllers
class UserController extends Controller {

    callCreateModel(req: Request, res: Response, next: Next): void {
        try {
            const promise = user.create({});
        } catch(error) {
            console.log(error);
        }
    }

    callUpdateModel(req: Request, res: Response, next: Next): void {
        try {
            const promise = user.update({});
        } catch(error) {
            console.log(error);
        }
    }

    callGetModel(req: Request, res: Response, next: Next): void {
        try {
            const promise = user.get('');
        } catch(error) {
            console.log(error);
        }
    }

    callGetAllModel(req: Request, res: Response, next: Next): void {
        try {
            const promise = user.getAll;
        } catch(error) {
            console.log(error);
        }
    }

    callDeleteModel(req: Request, res: Response, next: Next): void {
        try {
            const promise = user.delete('');
        } catch(error) {
            console.log(error);
        }
    }

    callEmailVerification(req: Request, res: Response, next: Next): void {
        try {
            const promise = user.delete('');
        } catch(error) {
            console.log(error);
        }
    }
    
}

export default UserController;