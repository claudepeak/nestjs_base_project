import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (!status || typeof status !== 'number' || isNaN(status)) {
      // If the status is invalid or not a number, set a default status code (e.g., 500)
      response.status(500).json({
        message: response.statusMessage || 'Internal server error',
        statusCode: response.statusCode || 500,
      });
    } else {
      // Valid status code, proceed as usual
      const message = exception.message || 'Internal server error'; // Varsayılan bir hata mesajı verin.

      response.status(status).json({
        message: message,
        statusCode: status,
      });
    }
  }
}
