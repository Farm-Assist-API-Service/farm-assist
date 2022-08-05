import { createServer } from "http";
import { AS, Iserver, IServerConfig, HttpDriver, Req, Res, IRouterMethods } from "../interfaces";

export class Server implements Iserver {
    public name: string;
    public httpDriver: HttpDriver;
    public wssDriver: any;
    private httpServer: any;
    public allowedMethod: AS;
    public allowedOrigins: AS;
    constructor(config: IServerConfig) {    
        this.name = config.name;
        this.httpDriver = config.httpDriver;
        this.wssDriver = config.wssDriver;
        this.allowedMethod = ['config.allowedMethod'];
        this.allowedOrigins = ['config.allowedOrigins'];
    }
    public initiate(port: number): object {
        if (this.httpDriver) {
            // throw new Error('An http driver is required');
            this.httpServer = createServer(this.httpDriver.default);
            this.httpServer.listen(port, () => console.log(`App running with ${this.name} Server on port: ${port}`));
        }
        
        if (this.wssDriver) {
            // throw new Error('A web socket driver is required');
            this.wssDriver(this.httpServer, this.allowedOrigins, this.allowedMethod)
            .then(console.log)
            .catch(console.log)
        }

        return this;
    }
    public middleware(url: string) {    
        console.log(url);
        this.httpDriver.default.get(url, (req: Req, res: Res) => {
            res.send(url)
        });
        return this;
    }
    public route(route: string): IRouterMethods {
        console.log(route);
        
        // get: this.httpDriver.router.get(route, this.httpDriver.adapter),
        return {
            get: this.httpDriver.router.get(route),
            post: this.httpDriver.router.post(route),
            put: this.httpDriver.router.put(route),
            delete: this.httpDriver.router.delete(route),
            patch: this.httpDriver.router.patch(route),
        }
    }
}

