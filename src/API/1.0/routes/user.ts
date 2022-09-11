import { Router } from "../../../schemas";
import { createUser, getAllUsers, getAUser } from "../controllers/user";

export default function(router: Router, httpAdapter:  Function) {
    router.route('/new')
        .post(httpAdapter(createUser))

    router.route('/all')
        .get(httpAdapter(getAllUsers))

    router.route('/:id')
        .get(httpAdapter(getAUser))
    return router;
}