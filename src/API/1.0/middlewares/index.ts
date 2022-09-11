import { Next, Req, Res, Router } from "../../../schemas";
// Exports all middlewares

export default function(PORT: number) {
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