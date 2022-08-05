import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Req, Res, App, Next, Router, IDatabase, IMain, Iserver, TMain } from "./interfaces";
import { userRoute } from "./routes";
import { headerControl } from "./middlewares";
import { APP_VAR } from "./configs";
import { webSocket } from "./utils";

export default function main() {
    const PORT = APP_VAR.serverPort;
    const app: App = express();
    const router: Router = express.Router();
    const corsOption = {
        origin: APP_VAR.allowedOrigins,
    };
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    
    app.use(cors(corsOption));
    
    // API STATUS CHECK
    app.get("/ping", (req: Req, res: Res, next: Next) => res.status(200).json({ message: "Pong!" }));
    
    app.use(headerControl(PORT));
    // ROUTES
    app.use("/api", userRoute(router));
    
    const httpServer = createServer(app).listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
    webSocket(httpServer);
};