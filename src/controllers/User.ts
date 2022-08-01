import Controller from './Controller';
import { UserModel } from '../models';
import { Req, Res, Next } from '../interfaces';

const user = new UserModel();

// User controllers
class UserController extends Controller {

    callCreateModel(req: Req, res: Res, next: Next): void {
        try {
            const promise = user.create({});
        } catch(error) {
            console.log(error);
        }
    }

    callUpdateModel(req: Req, res: Res, next: Next): void {
        try {
            const promise = user.update({});
        } catch(error) {
            console.log(error);
        }
    }

    callGetModel(req: Req, res: Res, next: Next): void {
        try {
            const promise = user.get('');
        } catch(error) {
            console.log(error);
        }
    }

    callGetAllModel(req: Req, res: Res, next: Next): void {
        try {
            const promise = user.getAll;
        } catch(error) {
            console.log(error);
        }
    }

    callDeleteModel(req: Req, res: Res, next: Next): void {
        try {
            const promise = user.delete('');
        } catch(error) {
            console.log(error);
        }
    }

    callEmailVerification(req: Req, res: Res, next: Next): void {
        try {
            const promise = user.delete('');
        } catch(error) {
            console.log(error);
        }
    }
    
}

export default UserController;