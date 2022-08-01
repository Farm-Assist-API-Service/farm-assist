import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Req, Res, App, Next, Router } from "./src/interfaces";
import { userRoute } from "./src/routes";
import middlewares from "./src/middlewares";
import { APP_VAR } from "./src/configs";
import { webSocket } from "./src/utils";

const httpServer = () => {
    const PORT = APP_VAR.serverPort;
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
    app.get("/ping", (req: Req, res: Res, next: Next) => res.status(200).json({ message: "Pong!" }));
    
    app.use(middlewares(PORT));
    // ROUTES
    app.use("/api", userRoute(router));
    
    const httpServer = createServer(app).listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
    webSocket(httpServer);
};
httpServer();