import { check } from "express-validator";

export const productRules = {
  creation: [
    check("price", "Please enter the price of this product to proceed")
      .not()
      .isEmpty()
      ,
    check("qty", "Please enter the quantity of product available to proceed")
      .not()
      .isEmpty()
      .isString(),
    check("description", "Please describe your product to proceed")
      .not()
      .isEmpty()
      .isString()
  ],
};