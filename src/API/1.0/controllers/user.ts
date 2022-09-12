import bcrypt from "bcrypt";
import { HttpRequest, EcontentType, EProtocolStatusCode, EProtocolMessages, EerrorMessages } from "../../../schemas";
import Repository from "../repository";

const { create, getAll, getOne, modifyOne } = new Repository('user');

export const createUser = async (request: HttpRequest) => {
    try {
        const body = request.body;
    
        const emailExist = await getOne({ email: body.email }, ['SourceInfo']);
        
        if (emailExist) {
            throw EerrorMessages.emailExist;
        }

        const { password, ...othersFields } = body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const modifiedData = { ...othersFields };
        modifiedData["password"] = hashedPassword;
        const data = await create(modifiedData);

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

export const authUser = async (request: HttpRequest) => {
    try {
        const { email, password } = request.body;
    
        const emailExist = await getOne({ email }, ['SourceInfo']);
        
        if (!emailExist) {
            throw EerrorMessages.wrongLogin;
        }

        const { password: savedPasswordHash } = emailExist;

        console.log({savedPasswordHash});
        // Compare password

        // if (!emailExist) {
        //     throw EerrorMessages.wrongLogin;
        // }

        return {
            headers: {
                contentType: EcontentType.json,
            },  
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.ok,
                data: {}
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

export const modifyUser = async (request: HttpRequest) => {
    try {
        const body = request.body;
        const param = request.params.id;
        const query = isEmail.valid(param) 
            ? { email: param }
            : { id: param }
        let modifiedData = body;

        const isValidEmail = isEmail.valid(query.email);
        if (!isValidEmail) {
            throw EerrorMessages.unRecogEmail;
        }

        const emailExist = await getOne(query, ['SourceInfo']);
        
        if (!emailExist) {
            throw EerrorMessages.notFound;
        }

        if ('email' in body) {
            const emailExist = await isEmail.registerable(body);
            if (emailExist) {
                throw EerrorMessages.emailExist;
            }
        }

        if ('password' in body) {
            const { password, ...othersFields } = body;
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            modifiedData = { ...othersFields };
            modifiedData["password"] = hashedPassword;
        }
        
        const data = await modifyOne(query, modifiedData, []);

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

const isEmail = {
    valid(str: string) {
        try {
            const validEmailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                .test(str);
            return validEmailRegExp;
        } catch (e) {
            throw e;
        } 
    },
    async registered(email: string) { // Throw error for unregistered email entry
        try {
            const emailExist = await getOne({ email }, ['SourceInfo']);
        
            if (emailExist) {
                throw EerrorMessages.emailExist;
            }
            return true;
        } catch (e) {
            throw e;
        }
    },

    async registerable(data: any) { //Checks if email can be registered
        try {
            // if ('email' in data) {
            const query = { email: data.email }
            const emailExist = await getOne(query, ['SourceInfo']);
            
            return emailExist
                ? true
                : false
            // }    
        } catch (e) {
            throw e;
        }
    },
}