import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ServerResponse } from '@spike/shared';
import type { Response } from 'express';
import { Observable, map } from 'rxjs';

/**
 * Wraps every successful handler result in a ServerResponse.
 * Handlers that already return a ServerResponse are passed through
 * (and their `status` is applied to the HTTP response).
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ServerResponse<unknown>> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result) => {
        if (result instanceof ServerResponse) {
          res.status(result.status);
          return result;
        }
        return new ServerResponse({
          status: res.statusCode,
          message: 'Success',
          data: result ?? null,
        });
      }),
    );
  }
}
