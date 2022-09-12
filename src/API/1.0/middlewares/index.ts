const { check, validationResult } = require("express-validator");
import { EerrorMessages,  EProtocolStatusCode, HttpRequest, Next, Req, Res, Router } from "../../../schemas";
// Exports all middlewares

export default function (PORT: number) {
  return (req: Req, res: Res, next: Next) => {
    const error = new Error("Not found");

    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
    }

    if (error.message) {
      res.status(404).json({ message: error.message });
    }

    console.log(
      `${req.method} http:localhost:${PORT}${req.baseUrl}${req.path}`
    );
    next();
  };
}

export const userDatavalidator = (req: Req, res: Res) => {
  const errors = validationResult(req);
  console.log(req.body);

  type Err = { value: string; msg: string; param: string; location: string };
  if (!errors.isEmpty()) {
    let formattedErrs: any = {};
    const errs = errors.array();
    for (const e in errs) {
        if (Object.prototype.hasOwnProperty.call(errs, e)) {
            const eachErr: Err = errs[e];
            formattedErrs = { ...formattedErrs, [eachErr.param] : errs[e] };
            
        }
    }
    
    return res
        .status(EProtocolStatusCode.unProcessableEntity)
        .send({
            error: EerrorMessages.unProcessableData,
            body: { reasons: formattedErrs }
        });
  } else {
    res.send({});
  }
};

// export const userDatavalidator = {
//     creation:  [
//         check('firstName').not().isEmpty().withMessage('First name must have more than 5 characters'),
//         check('middleName').not().isEmpty().withMessage('Middle name must have more than 5 characters'),
//         check('lastName').not().isEmpty().withMessage('Latt name must have more than 5 characters'),
//         check('email', 'Your email is not valid').not().isEmpty(),
//         check('password', 'Your password must be at least 5 characters').not().isEmpty(),
//       ],
// }
