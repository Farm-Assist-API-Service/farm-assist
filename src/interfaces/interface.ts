import { Request, Response, Application, NextFunction, IRouter } from "express";

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
export type App = Application;

// FsOpertaion Interface
export interface IFSOperation {
    readFile(props: Array<string>): Array<object>;
    writeFile(oject: object): Promise<string>;
}

// Model Interface
export interface IModel {
    create(user: object): PO;
    update(field: object): PO;
    delete(userID: string): PO;
    get(userID: string): PO;
    get getAll(): PA;
}

// Controller Interface
export interface IController {
    callCreateModel(req: object, res: object, next: object): void;
    callUpdateModel(req: object, res: object, next: object): void;
    callDeleteModel(req: object, res: object, next: object): void;
    callGetModel(req: object, res: object, next: object): void;
    callGetAllModel(req: object, res: object, next: object): void;
}

// Person Interface
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