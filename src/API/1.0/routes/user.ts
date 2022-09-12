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
      formDataRules.user.creation,
      userDatavalidator,
      httpAdapter(createUser)
    );

  router.route("/all").get(httpAdapter(getAllUsers));

  router.route("/:id").get(httpAdapter(getAUser)).put(httpAdapter(modifyUser));
  return router;
}

const formDataRules = {
  user: {
    creation: [
      check("firstName", "Please enter your first name")
        .not()
        .isEmpty()
        .isLength({ min: 3 })
        .withMessage("First name must have more than 5 characters"),
      check("middleName", "Please enter your middle name")
        .not()
        .isEmpty()
        .isLength({ min: 3 })
        .withMessage("Middle name must have more than 5 characters"),
      check("lastName", "Please enter your last name")
        .not()
        .isEmpty()
        .isLength({ min: 3 })
        .withMessage("Latt name must have more than 5 characters"),
      check("email", "Your email is not valid")
        .isEmail()
        .not()
        .isEmpty(),
      check("password", "Your password must be at least 8 characters")
        .not()
        .isEmpty()
        .isLength({ min: 8 }),
    ],
  },
};
