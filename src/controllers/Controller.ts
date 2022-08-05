import { Usecase, EcontentType, HttpResponse, HttpRequest } from "../interfaces";
// Controller Instance

type PHttpResponse = Promise<HttpResponse>;
export default class Controllers {
    public addEntity: Function;
    public removeEntity: Function;
    public modifiyEntity: Function;
    public getEntity: Function;
    constructor(usecase: Usecase) {
        this.addEntity = usecase.addEntity;
        this.removeEntity = usecase.removeEntity;
        this.modifiyEntity = usecase.modifiyEntity;
        this.getEntity = usecase.getEntity;
    }
    
    async registerEntity (httpRequest: HttpRequest): PHttpResponse {
        try {

            const source: {
                ip: string;
                browser: string | undefined;
                referrer?: string;
            } = {
                ip: httpRequest.ip,
                browser: httpRequest.headers.userAgent
            }

            const entityInfo = httpRequest.body
            
            if (httpRequest.headers.referrer) {
                source.referrer = httpRequest.headers.referrer
            }
            const posted = await this.addEntity({
                ...entityInfo,
                source
            });
            return {
                headers: {
                    contentType: EcontentType.josn,
                },
                statusCode: 201,
                body: { posted }
            }
            } catch (e: any) {
            // TODO: Error logging
            console.log(e)

            return {
                headers: {
                    contentType: EcontentType.josn
                },
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }

}

