import { Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

export class URLHelpers {
  static normalizeURL(@Req() req: Request, @Res() res: Response): string {
    const action = req.originalUrl.split('?action=')[1];
    if (!action) return;
    return action.slice(0, action.indexOf('&'));
  }

  static getURLParams(params: any): string {
    return Object.keys(params || {}).reduce((result, field) => {
      if (
        (typeof params[field] === 'string' && params[field]) ||
        typeof params[field] !== 'string'
      ) {
        result += result
          ? `&${field}=${params[field]}`
          : `?${field}=${params[field]}`;
      }
      return result;
    }, '');
  }
}
