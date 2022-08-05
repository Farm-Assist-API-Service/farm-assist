import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Req, Res, App, Next, Router, IDatabase, IMain, Iserver, TMain } from "./interfaces";
import { userRoute, authRoutes } from "./api/routes";
import { headerControl } from "./api/middlewares";
import { APP_VAR } from "./configs";
import { webSocket } from "./utils";

export default function main() {
    const apiRoot = APP_VAR.apiRoot;    
    const PORT = APP_VAR.serverPort;
    const app: App = express();
    const router: Router = express.Router();
    const corsOption = {
        origin: APP_VAR.allowedOrigins,
    };
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

    
    app.use(cors(corsOption));
    
    // API STATUS CHECK
    app.get("/ping", (req: Req, res: Res, next: Next) => res.status(200).json({ message: "Pong!" }));
    
    // app.use(headerControl(PORT));
    // ROUTES
    app.use(`/api/user`, userRoute(router));
    app.use(`/api/auth`, authRoutes(router));
    // app.use(`${apiRoot}/user`, userRoute(router));
    // app.use(`${apiRoot}/auth`, authRoutes(router));
    
    const httpServer = createServer(app).listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
    webSocket(httpServer);
};