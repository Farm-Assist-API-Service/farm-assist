import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method } = req;
    const { url } = req;
    const now = new Date().toISOString();
    const reqLogData = {
      method,
      url,
      time: now,
      body: JSON.stringify(req.body),
      query: JSON.stringify(req.query),
    };
    console.log('================= REQUEST ==================');
    console.log(reqLogData);
    console.log('================= REQUEST ==================');
    return next.handle().pipe(
      tap((res) => {
        const resLogData = {
          method,
          url,
          time: now,
          body: JSON.stringify(res),
        };
        console.log('================= RESPONSE ==================');
        console.log(resLogData);
        console.log('================= RESPONSE ==================');
        Logger.log(
          `${method} ${url} ${Date.now() - Date.now()}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}
