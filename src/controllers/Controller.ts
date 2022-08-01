import { IController, Req, Res, Next } from "../interfaces";
// Controller Instance

abstract class Controller implements IController {

    callCreateModel(req: Req, res: Res, next: Next): void {
        
    }

    callUpdateModel(req: Req, res: Res, next: Next): void {
        
    }

    callDeleteModel(req: Req, res: Res, next: Next): void {
        
    }

    callGetModel(req: Req, res: Res, next: Next): void {
        
    }

    callGetAllModel(req: Req, res: Res, next: Next): void {
        
    }

}

export default Controller;