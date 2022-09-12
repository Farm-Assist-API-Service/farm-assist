import { userRules } from "../../../rules";
import { Req, Res, Router } from "../../../schemas";
const { check, validationResult } = require("express-validator");
import {
  createUser,
  getAllUsers,
  getAUser,
  modifyUser,
} from "../controllers/user";
import { userDatavalidator } from "../middlewares";

export default function (router: Router, httpAdapter: Function) {
  router
    .route("/new")
    .post(
      userRules.update,
      userDatavalidator,
      httpAdapter(createUser)
    );

  router.route("/all").get(httpAdapter(getAllUsers));

  router.route("/:id").get(httpAdapter(getAUser)).put(httpAdapter(modifyUser));
  return router;
}
