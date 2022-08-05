import { Request, Response, Application, NextFunction, IRouter, ErrorRequestHandler, IRoute } from "express";

// Generic
export type PO = Promise<{}>;
export type PA = Promise<[]>;
export type PS = Promise<string>;
export type PN = Promise<number>;
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

export type HttpHeader = {
  contentType?: string;
  referrer?: string;
  userAgent?: string;
} 

export type HttpRequest = {
    body: object;
    query: object;
    params: object;
    ip: string;
    method: string;
    path: string;
    headers: HttpHeader;
}

export type HttpResponse = {
  headers: HttpHeader;
  body: object;
  statusCode: number;
}

export type Usecase = {
    addEntity: Function;
    removeEntity: Function;
    modifiyEntity: Function;
    getEntity: Function;
}

export interface IError {
    message: string;
    name: string;
    stack?: string;
}

export interface IModel {
    create(user: object): PO;
    update(field: object): PO;
    delete(userID: string): PO;
    get(userID: string): PO;
    get getAll(): PA;
}

export interface IController {
    registerEntity(req: object, res: object, next: object): void;
}

export interface IDatabase {
    findOne(query: string): PO;
    findAll(): PA;
}

export interface IDBDriver {
    name: string;
    URI: string;
    createConnection(database?: IDatabase): PO;
}

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

export type TMain = {
    port: number;
    database: IDatabase;
}

export interface IMain extends TMain {
    startServer(server: Iserver): any;
}




export interface IPerson {
    id: string; //  For mongoose use Object.id() type annotation
    firstName: string; 
    middleName: string;
    lastName: string;
    email: string;
    phone?: number;
}

// Farm Interface
export interface IFarm {
    id: string; //  For mongoose use Object.id() type annotation
    name: string;
    ownerName: string;
    contact: string; // User phone 
    address: string;
    size: number;
    products?: AO;
    media?: AO;
    description?: string;
    availability: boolean;
}