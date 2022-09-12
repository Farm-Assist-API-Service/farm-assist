import { check } from "express-validator";

export const farmRules = {
  creation: [
    check("name", "Please enter the name of your farm to proceed")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("Farm name must have more than 3 characters"),
    check("ownerName", "Please enter your names to proceed")
      .not()
      .isEmpty()
      .isString(),
    check("address", "Please enter your farm address to proceed")
      .not()
      .isEmpty()
      .isString(),
    check("size", "Please enter your farm size to proceed")
      .not()
      .isEmpty()
      .isString(),
    check("description", "Please describe your farm to proceed")
      .not()
      .isEmpty()
      .isString(),
  ],
};