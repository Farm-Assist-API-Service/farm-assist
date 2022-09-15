const { check, validationResult } = require("express-validator");
import {
  EerrorMessages,
  EProtocolStatusCode,
  HttpRequest,
  Next,
  Req,
  Res,
  EcontentType,
  EProtocolMessages,
  Router,
} from "../../../schemas";
import { tokenUtil } from "../../../utils/helpers";
// Exports all middlewares

type Err = { value: string; msg: string; param: string; location: string };

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

export const rulesProcessor = (req: Req, res: Res, next: Next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let formattedErrs: any = {};
    const errs = errors.array();
    for (const e in errs) {
      if (Object.prototype.hasOwnProperty.call(errs, e)) {
        const eachErr: Err = errs[e];
        formattedErrs = { ...formattedErrs, [eachErr.param]: errs[e] };
      }
    }

    return res.status(EProtocolStatusCode.unProcessableEntity).send({
      error: EerrorMessages.unProcessableData,
      body: { reasons: formattedErrs },
    });
  } else {
    next();
  }
};

export const generateAccessToken = (data: any) => {
  return tokenUtil.generateToken(data);
};

export const verifyAccessToken = async ({ url, headers }: HttpRequest) => {
  try {
    let token;
    if (url.includes("new")) {
      return {
        next: true
      };
    }

    if (headers.authorization && headers.authorization.startsWith("Bearer")) {
      token = headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw EerrorMessages.unAuthorized;
    }

    const decodedToken = tokenUtil.verifyToken(token);
    return {
      next: true
    };
  } catch (e: any) {
    // TODO: Error logging
    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: EProtocolStatusCode.unAuthorized,
      body: {
        message: EProtocolMessages.failed,
        error: e?.message || e,
      },
    };
  }
};
