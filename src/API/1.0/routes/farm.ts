import express from "express";
import { farmRules } from "../../../rules";
import { Router } from "../../../schemas";
import {
  createFarm,
  getAFarm,
  delAFarm
} from "../controllers/farm";
import { rulesProcessor } from "../middlewares";

export default function (httpAdapter: Function) {
  const router: Router = express.Router();
  router
    .route("/new")
    .post(
      farmRules.creation,
      rulesProcessor,
      httpAdapter(createFarm)
    );

  // router.route("/all").get(httpAdapter(getAllUsers));

  router.route("/:name")
    .get(httpAdapter(getAFarm))
    .delete(httpAdapter(delAFarm))
    
  return router;
}
