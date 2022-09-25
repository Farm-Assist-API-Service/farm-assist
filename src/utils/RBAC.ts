import { APP_VAR } from "../configs";
import { RequestLoad } from "../schemas";

export default class RBAC {
    public services = APP_VAR.services;
    public httpMethods = APP_VAR.httpMethods;
    public roles = APP_VAR.roles;
    public permissions: any = APP_VAR.permissions;

    constructor() {
        this.isAuthorized = this.isAuthorized.bind(this);
        this.convertHttpMethodToPermission = this.convertHttpMethodToPermission.bind(this);
        this.mount = this.mount.bind(this);
        this.util = this.util.bind(this);
    }

    isSelfJWT(email: string, decodedEmail: string, ignoreList: string[]) {
        try {
            if (ignoreList.includes(decodedEmail)) return;
            if (email !== decodedEmail) throw {
                error: 'ERR::UNAUTHORIZED_ACCESS',
                reason: 'You are not allowed'
            }
        } catch (error) {
            throw error;
        }
    }

    protected isAuthorized(role: string, permission: string, service: string, param: string) {  
        const action = `${permission}:${service}${param}`; 
        if (!(role in this.permissions)) return 'ROLE_NOT_IN_SCOPE';
        return this.permissions[role].includes('*') && true || this.permissions[role].includes(action)
            ? true
            : false;
    }

    protected convertHttpMethodToPermission(method: string) {
        if (method === 'GET') 
            return 'read';
        if (method === 'POST') 
            return 'write';
        if (method === 'PUT') 
            return 'update';
        if (method === 'DELETE') 
            return 'delete';
        return 'ACTION_NOT_IN_SCOPE';
    }


    mount(requestLoad: RequestLoad) {
        try {
            const {
                role, method, baseUrl, param
            } = requestLoad;

            const manyParam = 'all';
            const { sanitizeUrl, isParam, isValidString } = this.util();
            const permission = this.convertHttpMethodToPermission(method);
            
            if (!role && permission !== 'update') throw {
                error: 'ERR::UNSPECIFIED_USER',
                reason: 'User has no role'
            }

            const data = {
                role: isValidString(role, 'user role'),
                service: sanitizeUrl(baseUrl),
                param: isParam(param)
            }

            const isManyParamQuery = manyParam === data.param;
            const pluralizedServiceStr = data.param !== manyParam ? data.service : data.service+'s';
            if (method=='POST' && data.param == manyParam) throw {
                error: 'ERR::INVALID_OPERATION',
                reason: `This service does not support mutiple ${permission} operations.`
            }
            const hasAccess = this.isAuthorized(data.role, permission, data.service, isManyParamQuery ? ':'+data.param : '');
            if (!hasAccess) throw {
                error: 'ERR::UNAUTHORIZED_ACCESS',
                reason: 'You are not allowed'
                // reason: `${data.role} is unauthorized to ${permission} ${pluralizedServiceStr}`
            }
            return hasAccess;
                
        } catch (error) {
            throw error;
        }
    }

    protected util() {
        const isValidString = (data: string, placeholder: any) => {
            try {
                const isString = data.constructor === String;
                if (!isString) throw {
                    error: 'ERR::NOT_STRING',
                    reason: `${placeholder} must be a string`
                }
                const trimedData = data.trim();
                if (!trimedData) throw {
                    error: 'ERR::EMPTY_STRING',
                    reason: `${placeholder} cannot be an empty string`
                };
                return data;
            } catch (error) {
                throw error;
            }
        } 
        const isParam = (param: string) => {
            try {
                const data: any = isValidString(param, 'param');
                if (data.error) throw data.reason;
                return data;
            } catch (error) {
                throw error;
            }
        } 
        const sanitizeUrl = (url: string) => isValidString(url, 'url') && url.replace('/', '');
        return {
            isValidString,
            isParam,
            sanitizeUrl
        }
    }

}