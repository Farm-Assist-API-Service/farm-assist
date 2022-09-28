import express from "express";
import { userRules } from "../../../rules";
import { Router } from "../../../schemas";
import { authUser } from "../controllers";
import { rulesProcessor } from "../middlewares";



export default function (httpAdapter: Function) {
  const router: Router = express.Router();
  /**
   * @swagger
   * components:
   *  schemas:
   *  Authentication:
   *    type: object
   *    required:
   *      - email
   *      - password
   *    properties:
   *      email:
   *        type: string
   *        description: User email address
   *      password:
   *        type: string
   *        description: User password
   *    example:
   *      email: God'sgift Matthew Uko
   *      password: rqruasfFUHS8973()*
   */
  router
    .route("/")
    .post(userRules.auth, rulesProcessor, httpAdapter(authUser));

  return router;
}
