import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ServerResponse } from '@spike/shared';
import type { Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('EXCEPTION_FILTER');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<{ method: string; url: string }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        const b = body as { message?: string | string[]; error?: string };
        message = Array.isArray(b.message)
          ? b.message.join(', ')
          : (b.message ?? exception.message);
        error = Array.isArray(b.message) ? b.message : b.error;
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      error = exception.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
    } else if (this.isPrismaKnownError(exception)) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'A record with this value already exists';
          error = exception.meta;
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database request failed';
      }
    } else if (exception instanceof Error) {
      // Upstream HTTP client errors (e.g. Monnify) carry their own status
      const upstream = (exception as { status?: unknown }).status;
      if (
        exception.name === 'HttpResponseError' &&
        typeof upstream === 'number'
      ) {
        status = HttpStatus.BAD_GATEWAY;
        message = 'Upstream service request failed';
      }
    }

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${req.method} ${req.url} -> ${status}: ${message}`);
    }

    res
      .status(status)
      .json(new ServerResponse({ status, message, data: null, error }));
  }

  private isPrismaKnownError(
    e: unknown,
  ): e is { code: string; meta?: unknown } {
    return (
      e instanceof Error &&
      e.name === 'PrismaClientKnownRequestError' &&
      typeof (e as any).code === 'string'
    );
  }
}
