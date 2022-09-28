import { createServer } from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { Req, Res, App, Next, Router } from "./schemas";
import { userRoute, authRoute, farmRoute } from "./API/1.0/routes";
import { APP_VAR } from "./configs";
import { expressHttpAdapter } from "./adapters/express.adapter";
// import { auth, requiresAuth } from "express-openid-connect";
import { generateAccessToken, verifyAccessToken } from "./API/1.0/middlewares";
import { swaggerOptions } from "./helpers";


const httpServer = () => {
const PORT = APP_VAR.serverPort;
const apiPath = APP_VAR.apiPath; 
const app: App = express();
const router: Router = express.Router();
const corsOption = {
  origin: APP_VAR.allowedURL,
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(cors());

// app.use(cors(corsOption));

const config: any = {
  clientID: APP_VAR.OAuth.clientID,
  authRequired: false,
  auth0Logout: true,
  secret: APP_VAR.OAuth.authSecret,
  issuerBaseURL: APP_VAR.OAuth.issuerBaseURL,
};

if (
  !config.baseURL &&
  !config.baseURL &&
  PORT &&
  process.env.NODE_ENV !== "production"
) {
  config.baseURL = `http://localhost:${PORT}`;
}


  //   app.use(auth(config));

  // Middleware to make the `user` object available for all views
  //   app.use(function (req, res, next) {
  //     res.locals.user = req.oidc.user;
  //     console.log(res.locals.user);

  //     next();
  //   });

  
  // API STATUS CHECK
  app.get(`${apiPath}/ping`, (req: Req, res: Res, next: Next) =>
  res.status(200).json({ message: "Pong!" }));

  // app.use(middlewares(PORT));
  const apiSpecs = swaggerJsDoc(swaggerOptions);
  // ROUTES
  app.use(`${apiPath}/docs`, swaggerUI.serve, swaggerUI.setup(apiSpecs));
  app.use(`${apiPath}/auth`, authRoute(expressHttpAdapter));
  app.use(`${apiPath}/user`, expressHttpAdapter(verifyAccessToken), userRoute(expressHttpAdapter));
  app.use(`${apiPath}/farm`, expressHttpAdapter(verifyAccessToken), farmRoute(expressHttpAdapter));

  const httpServer = createServer(app).listen(PORT, () =>
    console.log(`Listening on ${config.baseURL}`)
  );
  // webSocket(httpServer);
};
httpServer();
