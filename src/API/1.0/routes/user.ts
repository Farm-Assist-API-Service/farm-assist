import express from "express";
import { userRules } from "../../../rules";
import { Req, Res, Router } from "../../../schemas";
import {
  createUser,
  getAllUsers,
  getAUser,
  modifyUser,
  delAUser,
} from "../controllers/user";
import { persistPermissions, onlyAdminsCanAccess, rulesProcessor } from "../middlewares";

export default function (httpAdapter: Function) {
  const router: Router = express.Router();
  router.route("/new")
    .post(
      userRules.creation,
      rulesProcessor,
      httpAdapter(createUser)
    );

  router.route("/all")
    .get(
      httpAdapter(persistPermissions),
      httpAdapter(getAllUsers)
    );

  router.route("/:id")
    .get(
      httpAdapter(persistPermissions),
      httpAdapter(getAUser)
    )
    .put(
      userRules.update,
      rulesProcessor,
      httpAdapter(persistPermissions),
      httpAdapter(modifyUser)
    )
    .delete(
      httpAdapter(persistPermissions),
      httpAdapter(delAUser)
    );
  return router;
}
