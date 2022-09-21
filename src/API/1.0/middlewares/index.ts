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
  EUserRole,
  RequestLoad,
} from "../../../schemas";
import { tokenUtil, RBAC, getUserRole } from "../../../utils";

type Err = { value: string; msg: string; param: string; location: string };

export const headerControl = (PORT: number) => {
    return (req: Req, res: Res, next: Next) => {
        const error = new Error("Not found");
        
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        if (req.method == "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        }
        
        if (error.message) {
            res.status(EProtocolStatusCode.notFound).json({ message: error.message });
        }

        console.log(`${req.method} http:localhost:${PORT}${req.baseUrl}${req.path}`);
        next();
    }
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


export const grantPermissions = (req: any, res: Res, next: Next) => {
    try {
        const { method, baseUrl, url } = req;

        const { mount } = new RBAC();
        
        if (!('role' in req.user.data)) {
            return res.sendStatus(400);
        }
        const { role } = req.user.data;
        const service = req.baseUrl.split("/").filter(Boolean)[1];
        // console.log({user: req.user, service, method});
        // console.log({url, params: req.params, baseUrl, service});
        const requestLoad: RequestLoad = {
            role: role.name,
            baseUrl: service,
            method,
            param: url === '/all' ? url.replace('/','') : req.params.id
        }

        const is = mount(requestLoad);
        console.log({is});
        next()
    } catch (error) {
        res.status(500).send({ error: error || 'An unkown error occurred.' });
    }
}

export const grantAdminPermissions = (req: any, res: Res, next: Next) => {
    if (!('role' in req.user.data)) {
        return res.sendStatus(400);
    }
    const { role } = req.user.data;
    // console.log(req.user);
    
    if (role?.name !== getUserRole(EUserRole.admin).name) {
        return res.sendStatus(401);
    }
    next()

}

export const grantBuyerPermissions = (req: any, res: Res, next: Next) => {
    if (!('role' in req.user.data)) {
        return res.sendStatus(400);
    }
    const { role } = req.user.data;
    console.log(req.user);
    
    if (role?.name !== getUserRole(EUserRole.buyer).name) {
        return res.sendStatus(401);
    }
    next()

}

export const grantSellerPermissions = (req: any, res: Res, next: Next) => {
    if (!('role' in req.user.data)) {
        return res.sendStatus(400);
    }
    const { role } = req.user.data;
    console.log(req.user);
    
    if (role?.name !== getUserRole(EUserRole.seller).name) {
        return res.sendStatus(401);
    }
    next()

}
