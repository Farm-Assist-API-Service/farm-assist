import { HttpRequest, EcontentType, EProtocolStatusCode, EProtocolMessages, EerrorMessages, User } from "../../../schemas";
import { hashUtil, tokenUtil } from "../../../utils/helpers";
import Repository from "../repository";

const { create, getAll, getOne, modifyOne, delOne } = new Repository('user');

export const createUser = async (request: HttpRequest) => {
    try {
        let emailExist: User;
        const body = request.body;
        const {
            count,
            user
        } = await getAll(['sourceInfo', 'farm']);
        

        
        if (!count) {
            await createAdmin();
        }
        
        const thisUser = (user: User) => user.email === body.email;
        emailExist = user.find(thisUser);
        console.log({emailExist});
        
        // emailExist = await getOne({ email: body.email }, ['sourceInfo']);

        if (emailExist) {
            throw EerrorMessages.emailExist;
        }

        const { password, ...othersFields } = body;
        const hashedPassword = await hashUtil.generateHash(password);

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
    
        const emailExist = await getOne({ email }, ['sourceInfo']);
        
        if (!emailExist) {
            throw EerrorMessages.wrongLogin;
        }

        const { password: savedPasswordHash } = emailExist;
        const match = await hashUtil.verifyHash(password, savedPasswordHash);

        if (!match) {
            throw EerrorMessages.wrongLogin;
        }

        const payload = { email: emailExist.email, role: emailExist.role }
        const token = tokenUtil.generateToken(payload);
        
        return {
            headers: {
                contentType: EcontentType.json,
            },  
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.ok,
                data: { token }
            }
        }
        } catch (e: any) {
        // TODO: Error logging

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

export const delAUser = async (request: HttpRequest) => {
    try {
            const param = request.params.id;
            const query = isEmail.valid(param) 
                ? { email: param }
                : { id: param }

            const isValidEmail = isEmail.valid(query.email);
            if (!isValidEmail) {
                throw EerrorMessages.unRecogEmail;
            }

            const userExist = await getOne(query);
            if (!userExist) {
                throw EerrorMessages.notFound;
            }

            const deleted = await delOne(query);
            return {
                headers: {
                    contentType: EcontentType.json,
                },
                statusCode: EProtocolStatusCode.ok,
                body: { 
                    message: EProtocolMessages.deleted,
                    data: deleted
                }
            }
    } catch (e: any) {
        // TODO: Error logging

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
        const user = await getOne({ email: query.id }, ['sourceInfo']);
        const data = !user ? EerrorMessages.notFound : user;
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
        const users = await getAll(['sourceInfo', 'farm']);
        return {
            headers: {
                contentType: EcontentType.json,
            },
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.ok,
                data: users
            }
        }
    } catch (e: any) {
        // TODO: Error logging

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

        const isValidEmail = isEmail.valid(query.email);
        if (!isValidEmail) {
            throw EerrorMessages.unRecogEmail;
        }

        const emailExist = await getOne(query, ['sourceInfo']);
        
        if (!emailExist) {
            throw EerrorMessages.notFound;
        }

        let modifiedData = {
            isVerified: body.isVerified 
                ? body.isVerified 
                : emailExist.isVerified,
            banned: body.banned 
                ? body.banned 
                : emailExist.banned,
            firstName: body.firstName 
                ? body.firstName 
                : emailExist.firstName,
            middleName: body.middleName 
                ? body.middleName 
                : emailExist.middleName,
            lastName: body.lastName 
                ? body.lastName 
                : emailExist.lastName,
            gender: body.gender 
                ? body.gender 
                : emailExist.gender,
            phone: body.phone 
                ? body.phone 
                : emailExist.phone,
            password: body.password 
                ? emailExist.password 
                : emailExist.password,
            email: body.email 
                ? body.email 
                : emailExist.email,
            role: body.role 
                ? body.role 
                : emailExist.role
        };

        if ('email' in body) {
            const emailExist = await isEmail.registerable(body);
            if (emailExist) {
                throw EerrorMessages.emailExist;
            }
        }

        if ('password' in body) {
            const { password, ...othersFields } = body;
            const hashedPassword = await hashUtil.generateHash(password);

            modifiedData = { ...othersFields };
            modifiedData["password"] = hashedPassword;
        }

        const data = await modifyOne(query, modifiedData);
        delete data.password;

        return {
            headers: {
                contentType: EcontentType.json,
            },
            statusCode: EProtocolStatusCode.ok,
            body: { 
                message: EProtocolMessages.updated,
                data
            }
        }
    } catch (e: any) {
        // TODO: Error logging

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
            const emailExist = await getOne({ email }, ['sourceInfo']);
        
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
            const emailExist = await getOne(query, ['sourceInfo']);
            
            return emailExist
                ? true
                : false
            // }    
        } catch (e) {
            throw e;
        }
    },
}

const createAdmin = async () => {
        console.log('Created admin');
        
}