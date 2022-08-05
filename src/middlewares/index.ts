import { Next, Req, Res, Router } from "../interfaces";
const jwt = require('jsonwebtoken');
import { APP_VAR } from '../configs';
// Exports all middlewares

export const headerControl = (PORT: number) => {
    return (req: Req, res: Res, next: Next) => {
        const error = new Error("Not found");
        
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        if (req.method == "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        }
        
        if (error.message) {
            res.status(404).json({ message: error.message });
        }

        console.log(`${req.method} http:localhost:${PORT}${req.baseUrl}${req.path}`);
        next();
    }
}

export const authenticateToken = (req: any, res: Res, next: Next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, APP_VAR.tokenSecret as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

export const generateAccessToken = (email: string) => {
    return jwt.sign({
        data: email
    }, APP_VAR.tokenSecret, { expiresIn: APP_VAR.tokenExpiry });
}