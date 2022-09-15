import {
    HttpRequest,
    EcontentType,
    EProtocolStatusCode,
    EProtocolMessages,
    EerrorMessages,
  } from "../../../schemas";

export class Controller {

    controlEntity(data: any) {
        try {
            return {
              headers: {
                contentType: EcontentType.json,
              },
              statusCode: EProtocolStatusCode.ok,
              body: {
                message: EProtocolMessages.ok,
                data,
              },
            };
          } catch (e: any) {
            // TODO: Error logging
            console.log(e);
        
            return {
              headers: {
                contentType: EcontentType.json,
              },
              statusCode: EProtocolStatusCode.badRequest,
              body: {
                message: EProtocolMessages.failed,
                error: e?.message || e,
              },
            };
          }
    }


}