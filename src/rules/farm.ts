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
    check("contact", "Please enter your farm contact detail to proceed")
      .not()
      .isEmpty()
      .isString(),
    check("description", "Please describe your farm to proceed")
      .not()
      .isEmpty()
      .isString(),
    check("category", "Please choose a category to proceed")
      .not()
      .isEmpty()
      .isString(),
  ],
  update: [
  ]
};