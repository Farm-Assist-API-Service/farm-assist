import express from "express";
import { userRules } from "../../../rules";
import { Req, Res, Router } from "../../../schemas";
import {
  createUser,
  getAllUsers,
  getAUser,
  modifyUser,
} from "../controllers/user";
import { rulesProcessor } from "../middlewares";

export default function (httpAdapter: Function) {
  const router: Router = express.Router();
  router
    .route("/new")
    .post(
      userRules.creation,
      rulesProcessor,
      httpAdapter(createUser)
    );

  router.route("/all").get(httpAdapter(getAllUsers));

  router.route("/:id").get(httpAdapter(getAUser)).put(httpAdapter(modifyUser));
  return router;
}
