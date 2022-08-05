import { expressHttpAdapter } from "../adapters";
import { userController } from "..";
import { Router } from "../../interfaces";



export default function userRoutes(router: Router) {
    router
        .post('/register', expressHttpAdapter(userController.registerEntity));
    return router;
}