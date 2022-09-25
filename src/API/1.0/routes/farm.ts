import express from "express";
import { farmRules } from "../../../rules";
import { Router } from "../../../schemas";
import {
  createFarm,
  getAFarm,
  delAFarm
} from "../controllers/farm";
import { persistPermissions, rulesProcessor } from "../middlewares";

export default function (httpAdapter: Function) {
  const router: Router = express.Router();
  router
    .route("/new")
    .post(
      farmRules.creation,
      rulesProcessor,
      httpAdapter(persistPermissions),
      httpAdapter(createFarm)
    );

  // router.route("/all").get(httpAdapter(getAllUsers));

  router.route("/:id")
    .get(
      httpAdapter(persistPermissions),
      httpAdapter(getAFarm)
    )
    .delete(
      httpAdapter(persistPermissions),
      httpAdapter(delAFarm)
    )
    
  return router;
}
