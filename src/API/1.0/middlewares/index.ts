const { check, validationResult } = require("express-validator");
import { APP_VAR } from "../../../configs";
import { isEmail } from "../../../helpers";
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
import Repository from "../repository";

const { getOne } = new Repository('user');

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

export const verifyAccessToken = async ({ url, headers, baseUrl }: HttpRequest) => {
  try {
    let token;
    const targetUrl = baseUrl.includes('user') && url.includes("new");
    if (targetUrl) {
      return {
        next: {}
      };
    }

    if (headers.authorization && headers.authorization.startsWith("Bearer")) {
      token = headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw EerrorMessages.unAuthorized;
    }

    const { email, role }: any = tokenUtil.verifyToken(token);
    const userExist = await getOne({ email });

    if (!userExist) {
      throw EerrorMessages.notFound;
    }
    
    if (userExist.role !== role) {
      throw EerrorMessages.falsyUserClaim;
    }

    delete userExist.password;

    return {
      next: userExist
    };
  } catch (e: any) {
    // TODO: Error logging
    return {
      headers: {
        contentType: EcontentType.json,
      },
      statusCode: e === EerrorMessages.notFound 
        ? EProtocolStatusCode.notFound 
        : EProtocolStatusCode.unAuthorized,
      body: {
        message: EProtocolMessages.failed,
        error: e?.message || e,
      },
    };
  }
};


export const persistPermissions = async ({ url, params, user, method, baseUrl, headers }: HttpRequest) => {
  try {
        const { mount, isSelfJWT } = new RBAC();
        const targetUrl = ['/new', '/all'];
        const sanitizedUrl = targetUrl.includes(url) ? url.replace('/', '') : params.id;

        const isValidEmail = isEmail(sanitizedUrl);

        if (!('role' in user)) {  
            throw EerrorMessages.falsyUserClaim;
        }
        const { role, email: decodedEmail } = user;
        const service = baseUrl.split("/").filter(Boolean)[1];  
        const requestLoad: RequestLoad = {
          role,
          baseUrl: service,
          method,
          param: sanitizedUrl
        }

        if (isValidEmail) {
          const email = params.id;
          const canAccess = isSelfJWT(email, decodedEmail, [
            APP_VAR.admin.email
          ]);
          // console.log({ canAccess, email });
          
        }

        const hasMounted = mount(requestLoad);
        return {
          next: {}
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
}

export const onlyAdminsCanAccess = (req: any, res: Res, next: Next) => {
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
