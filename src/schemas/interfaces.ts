import { Request, Response, Application, NextFunction, IRouter, ErrorRequestHandler, IRoute } from "express";

// Generic
export type PO = Promise<{}>;
export type PA = Promise<[]>;
export type PS = Promise<string>;
export type POS = Promise<object | string>;
export type PN = Promise<number>;
export type PON = Promise<object | number>;
export type PB = Promise<boolean>;
export type MP = Promise<any>;
export type AO = Array<object>;
export type AS = Array<string>;
export type AN = Array<number>;
export type AB = Array<boolean>;
export type MA = Array<any>;

// Http
export type Res = Response;
export type Req = Request;
export type Next = NextFunction;
export type Router = IRouter;
export type Route = IRoute;
export type App = Application;
export type HttpErr = ErrorRequestHandler


export type DBVAR = {
    connectionURI: string;
    collectionsNames: CollecionsNames;
}

export type APPVAR = {
    serverPort: number;
    allowedOrigins: Array<string>;
    httpMethods: Array<string>;
    tokenSecret: string;
    tokenExpiry: number;
    adminMail: string;
    adminPSW: string;
    apiRoot: string;
    permissions: object;
    services: string[];
    roles: object;
    passwordVAR: {
        salt: string;
        sha: string;
        hashIteration: number;
    }
}

export type sourceInfo = {
    ip: string;
    userAgent?: string;
    referrer?: string;
}

export type HttpHeader = {
  contentType?: string;
  referrer?: string;
  userAgent?: string;
  authorization?: string;
} 

export type RequestLoad = {
    role: string,
    baseUrl: string,
    method: string,
    param: string,
}

export type HttpRequest = {
    body: any;
    query: object;
    params: any;
    baseUrl: string;
    url: string;
    user: {
        email: string;
        role: { code: string, name: string };
    },
    isAuthenticated: any;
    ip: string;
    method: string;
    path: string;
    headers: HttpHeader;
}

export type HttpResponse = {
  headers: HttpHeader;
  body: object;
  statusCode: number;
  next?: any;
}

export type Interactors = {
    addEntityInteractor: Function;
    removeEntityInteractor: Function;
    modifiyEntityInteractor: Function;
    getEntityInteractor: Function;
    getEntitiesInteractor: Function;
}

export interface IUsecases<C, G> {
    createUser(entity: C): Promise<C>; 
    getUser(data: Object | string): Promise<User[] | User | string>;
    getAllUsers(): Promise<{ users: User[], count: number } | string>; 
    getUserByAuth(entity: LoginCred): Promise<LoginCred>;
    modifyUser(entity: any): Promise<User>;
    removeUser(paramsInfo: string): Promise<string>; 
}

export interface IError {
    message: string;
    name: string;
    stack?: string;
}

export interface IModel {
    get schema(): any;
    create(entity: any): any;
}

export interface IController {
    registerEntity(req: object, res: object, next: object): void;
}

export interface IDBConn extends IDB {
    status: boolean;    
    conn: Promise<object>;
} 

export interface IDBDriver extends IDB {
    readonly dbName: string;
    readonly URI: string;
    readonly collectionsNames: CollecionsNames;
    createConnection(): POS;
}

export type KeyValPair = { key: string, value: string }
export type ManyKeyValPairs = Array<KeyValPair>

export interface IServerConfig {
    name: string;
    httpDriver: HttpDriver;
    wssDriver: Function;
    // allowedOrigins: AS;
    // allowedMethod: AS;
}

export interface IRouterMethods {
    get: Function;
    post: Function;
    put: Function;
    delete: Function;
    patch: Function;
}

export interface Iserver extends IServerConfig {
    allowedOrigins: AS;
    allowedMethod: AS;
    initiate(port: number): object;
    middleware(url: string): void;
    route(route: string): IRouterMethods;
}

export type HttpDriver = {
    default: any;
    set: any;
    router: Router;
    middleware: any;
    adapter: Function;
}

export type PUser = Promise<User>;
export type PUserNull = Promise<User | null>;
export type PUserStr = Promise<User | string>;
export type PUserArrNull = Promise<User[] | null>;
export type CollecionsNames = {
    user: string;
    farm: string;
    media: string;
}

export type CollectionOperations = {
    getOne(collection: any): Function;
    modifyOne(collection: any): Function;
    removeOne(collection: any): Function;
    get getAll(): Function;
    findMany(collection: any): Function;
    insert(collection: any): Function;
}

export interface IDB extends CollectionOperations {
    get collections(): any;
    createConnection(): POS;
}

export type LoginCred = { email: string, password: string };

export type Field = {
    name: string;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    default?: any;
    enum?: any[];
    type: any;
}

export type Role = {
    code: string | null;
    name: string | null;
}

export type User = {
    id:         string;
  isVerified: boolean;     
  banned:     boolean;
  firstName:  string;
  middleName: string;
  lastName:   string;
  email:      string;       
  gender:     string;
  password:   string;
  phone:      string;
  role:       string;      
  createdAt:  Date;    
  updatedAt:  Date;     
  SourceInfo: string[];
  farm?:       object;
}

// export type User = {
//     id: string; //  For mongoose use Object.id() type annotation
//     isVerified: boolean;
//     banned: boolean;
//     userInfo: Person;
//     sourceInfo: sourceInfo;
// }


// Farm Interface
export type Farm = {
    id: string; //  For mongoose use Object.id() type annotation
    banned: boolean;
    isVerified: boolean;
    name: string;
    ownerName: string;
    contact: string; // User phone 
    address: string;
    size: number;
    products?: AO;
    description?: string;
}