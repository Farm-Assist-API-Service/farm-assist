import { Router } from "../../../schemas";
import { authUser } from "../controllers/user";

export default function(router: Router, httpAdapter:  Function) {
    router.route('/')
        .post(httpAdapter(authUser))

    return router;
}