import { Req, Res, HttpRequest, HttpResponse, Next } from "../schemas";

export const expressHttpAdapter = (controller: any) => {
  return (req: any, res: Res, next: Next) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      url: req.url,
      baseUrl: req.baseUrl,
      ip: req.ip,
      isAuthenticated: req?.oidc?.isAuthenticated(),
      user: req?.user,
      method: req.method,
      path: req.path,
      headers: {
        contentType: req.get('Content-Type'),
        referrer: req.get('referer'),
        authorization: req.get('authorization'),
        userAgent: req.get('User-Agent')
      }
    }

    controller(httpRequest)
      .then((httpResponse: HttpResponse) => { 
        if (httpResponse.next) {
          const data = httpResponse.next;
          
          if (data.constructor === Object) {
            if ('email' in httpResponse.next) {
              req.user = httpResponse.next;
            }
          }
          return next();
        }
        if (httpResponse) {
          res.set(httpResponse.headers)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      })
      .catch((e: any) => {
        console.log({e});
        
        res.status(500).send({ error: e || 'An unkown error occurred.' })
      })
  }
}