import { HttpRequest, EcontentType, EProtocolStatusCode, EProtocolMessages } from "../../../schemas";
import Repository from "../repository";

const { create, getAll, getOne } = new Repository('user');

export const createUser = async (request: HttpRequest) => {
    try {
        const body = request.body;
        const data = await create(body);

        return {
            headers: {
                contentType: EcontentType.json,
            },
            statusCode: EProtocolStatusCode.created,
            body: { 
                message: EProtocolMessages.created,
                data
            }
        }
        } catch (e: any) {
        // TODO: Error logging
        console.log({e})

        return {
            headers: {
                contentType: EcontentType.json
            },
            statusCode: EProtocolStatusCode.badRequest,
            body: {
                message: EProtocolMessages.failed,
                error: e?.message || e
            }
        }
    }
}

export const getAUser = async (request: HttpRequest) => {
    try {
        const query = request.params;
        // console.log({query});
        
        const data = await getOne({ email: query.id }, ['SourceInfo']);

        return {
            headers: {
                contentType: EcontentType.json,
            },
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.ok,
                data
            }
        }
        } catch (e: any) {
        // TODO: Error logging
        console.log(e)

        return {
            headers: {
                contentType: EcontentType.json
            },
            statusCode: EProtocolStatusCode.badRequest,
            body: {
                message: EProtocolMessages.failed,
                error: e?.message || e
            }
        }
    }
}

export const getAllUsers = async (request: HttpRequest) => {
    try {
        const data = await getAll(['SourceInfo', 'farm']);

        return {
            headers: {
                contentType: EcontentType.json,
            },
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.ok,
                data
            }
        }
        } catch (e: any) {
        // TODO: Error logging
        console.log(e)

        return {
            headers: {
                contentType: EcontentType.json
            },
            statusCode: EProtocolStatusCode.badRequest,
            body: {
                message: EProtocolMessages.failed,
                error: e?.message || e
            }
        }
    }
}