import {
  Request,
  Response,
  Application,
  NextFunction,
  IRouter,
  ErrorRequestHandler,
  IRoute,
} from 'express';

// Http
export type Res = Response;
export type Req = Request;
export type Next = NextFunction;
export type Router = IRouter;
export type Route = IRoute;
export type App = Application;
export type HttpErr = ErrorRequestHandler;

export type HttpHeader = {
  contentType?: string;
  authorization?: string;
};

export type HttpRequest = {
  body: any;
  query: object;
  params: any;
  baseUrl: string;
  url: string;
  user: any;
  isAuthenticated: any;
  method: string;
  path: string;
  headers: HttpHeader;
};

export type HttpResponse = {
  headers: HttpHeader;
  body: object;
  statusCode: number;
  next?: any;
  user?: { email: string; role: string };
};

export type JwtPayload = {
  expiresIn: string;
  sub: number;
  phone: string;
};
