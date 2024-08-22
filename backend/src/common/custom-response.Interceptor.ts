import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError, map } from 'rxjs/operators';
  
  @Injectable()
  export class CustomResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const statusCode = response.statusCode;
  
      return next.handle().pipe(
        map((data) => ({
          statusCode,
          message: data.message || 'Success', 
          error: null,
          timestamp: new Date().toISOString(),
          path: request.url,
          data: data.data || data,
        })),
        catchError((err) => {
          const statusCode = err instanceof HttpException ? err.getStatus() : 500;
          const responseBody = err.getResponse ? err.getResponse() : {};
  
          const errorResponse = {
            statusCode,
            message: typeof responseBody === 'string' ? responseBody : responseBody.message || 'Internal server error',
            error: err.name || 'Error',
            timestamp: new Date().toISOString(),
            path: request.url,
            data: responseBody?.data || {},
          };
  
          return throwError(() => new HttpException(errorResponse, statusCode));
        }),
      );
    }
  }
  