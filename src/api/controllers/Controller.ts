import { randomUUID } from  "crypto";
import { 
    Usecase, 
    EcontentType, 
    HttpResponse, 
    HttpRequest, 
    User, 
    Person, 
    sourceInfo, 
    EProtocolStatusCode 
} from "../../interfaces";
// Controller Instance

type PHttpResponse = Promise<HttpResponse>;

export default class Controllers {
    private static addEntity: any;
    private static removeEntity: Function;
    private static modifiyEntity: Function;
    private static getEntity: Function;
    static registerUses(usecase: Usecase) {
        this.addEntity = usecase.addEntity;
        this.removeEntity = usecase.removeEntity;
        this.modifiyEntity = usecase.modifiyEntity;
        this.getEntity = usecase.getEntity;
        
    }

    async registerEntity (httpRequest: HttpRequest): PHttpResponse {
        try {
            
            const sourceInfo: sourceInfo = {
                ip: httpRequest.ip,
                userAgent: httpRequest.headers.userAgent,
            }

            const entityInfo = httpRequest.body            

            const userInfo: Person = {
                firstName: entityInfo?.firstName,
                lastName: entityInfo?.lastName,
                middleName: entityInfo?.middleName,
                email: entityInfo?.email,
                password: entityInfo?.password,
            }

            if (httpRequest.headers.referrer) {
                sourceInfo.referrer = httpRequest.headers.referrer
            }

            const created = await Controllers.addEntity({
                id: randomUUID(),
                userInfo,
                sourceInfo
            });

            return {
                headers: {
                    contentType: EcontentType.josn,
                },
                statusCode: EProtocolStatusCode.created,
                body: { created }
            }
            } catch (e: any) {
            // TODO: Error logging
            console.log(e)

            return {
                headers: {
                    contentType: EcontentType.josn
                },
                statusCode: EProtocolStatusCode.badRequest,
                body: {
                    error: e.message
                }
            }
        }
    }

}

