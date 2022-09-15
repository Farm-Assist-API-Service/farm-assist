import { check } from "express-validator";

export const userRules = {
  creation: [
    check("firstName", "Please enter your first name")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("First name must have more than 3 characters"),
    check("middleName", "Please enter your middle name")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("Middle name must have more than 3 characters"),
    check("lastName", "Please enter your last name")
      .not()
      .isEmpty()
      .isLength({ min: 3 })
      .withMessage("Last name must have more than 3 characters"),
    check("email", "Your email is not valid")
      .isEmail()
      .not()
      .isEmpty(),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Please enter password")
      .isStrongPassword()
      .withMessage("Password must contain special characters")
      .isLength({ min: 8 })
      .withMessage("Your password must be at least 8 characters"),
  ],
  auth: [
    check("email", "Please enter your email")
      .isEmail()
      .withMessage("Your email is not valid")
      .not()
      .isEmpty(),
    check("password", "Please enter your password")
      .not()
      .isEmpty()
  ],
  update: [
    check("firstName")
      .optional()
      .isLength({ min: 3 })
      .withMessage("First name must have more than 3 characters")
      // .isString()
      // .not()
      // .withMessage("First name must be string")
      ,
    check("middleName")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Middle name must have more than 3 characters")
      // .isString()
      // .not()
      // .withMessage("Middle name must be string")
      ,
    check("lastName")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Last name must have more than 3 characters")
      // .isString()
      // .not()
      // .withMessage("Last name must be string")
      ,
    check("email")
      .optional()
      .isEmail()
      .withMessage("Your email is not valid"),
    check("phone")
      .optional()
      // .not()
      .isMobilePhone('en-NG')
      .withMessage("Mobile number is invalid"),
    check("password")
      .optional()
      .isStrongPassword()
      .withMessage("Password must contain special characters")
      .isLength({ min: 8 })
      .withMessage("Your password must be at least 8 characters"),
  ],
};
