import { Req, Res, HttpRequest, HttpResponse } from "../../interfaces";

export const expressHttpAdapter = (controller: any) => {
  return (req: Req, res: Res) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        contentType: req.get('Content-Type'),
        referrer: req.get('referer'),
        userAgent: req.get('User-Agent')
      }
    }

    console.log('Adapter is working');
    
    controller(httpRequest)
      .then((httpResponse: HttpResponse) => { 
        if (httpResponse) {
          res.set(httpResponse.headers)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      })
      .catch((e: any) => res.status(500).send({ error: 'An unkown error occurred.' }))
  }
}