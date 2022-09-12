import { userRules } from "../../../rules";
import { Router } from "../../../schemas";
import { authUser } from "../controllers/user";
import { userDatavalidator } from "../middlewares";

export default function (router: Router, httpAdapter: Function) {
  router
    .route("/")
    .post(userRules.auth, userDatavalidator, httpAdapter(authUser));

  return router;
}
