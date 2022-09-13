import express from "express";
import { userRules } from "../../../rules";
import { Router } from "../../../schemas";
import { authUser } from "../controllers";
import { rulesProcessor } from "../middlewares";

export default function (httpAdapter: Function) {
  const router: Router = express.Router();
  router
    .route("/")
    .post(userRules.auth, rulesProcessor, httpAdapter(authUser));

  return router;
}
