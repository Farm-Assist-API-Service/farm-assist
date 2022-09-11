import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Req, Res, App, Next, Router } from "./schemas";
import { userRoute } from "./API/1.0/routes";
import { APP_VAR } from "./configs";
import { expressHttpAdapter } from "./adapters/express.adapter";

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
    app.use(cors());

    
    app.use(cors(corsOption));
    
    // API STATUS CHECK
    app.get(`${apiPath}/ping`, (req: Req, res: Res, next: Next) => res.status(200).json({ message: "Pong!" }));
    
    // app.use(middlewares(PORT));
    // ROUTES
    app.use(`${apiPath}/user`, userRoute(router, expressHttpAdapter));
    
    const httpServer = createServer(app).listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
    // webSocket(httpServer);
};
httpServer();