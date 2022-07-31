import { IController, Request, Response, Next } from "../interfaces";
// Controller Instance

abstract class Controller implements IController {

    callCreateModel(req: Request, res: Response, next: Next): void {
        
    }

    callUpdateModel(req: Request, res: Response, next: Next): void {
        
    }

    callDeleteModel(req: Request, res: Response, next: Next): void {
        
    }

    callGetModel(req: Request, res: Response, next: Next): void {
        
    }

    callGetAllModel(req: Request, res: Response, next: Next): void {
        
    }

}

export default Controller;