// logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const userId = req.user ? req.user.id : 'anonymous';

    // Konsol için başarılı istekleri loglama
    res.on('finish', () => {
      const logResponse = `User ID: ${userId}, Response sent: ${
        res.statusCode
      }, Request: ${req.method} ${req.originalUrl}  | (Status: ${JSON.stringify(
        res.statusMessage,
      )})`;
      console.log(logResponse);
      // Logger Middleware ile başarısız isteklerin log verilerini Azure Monitor'a gönderme
      if (res.statusCode >= 400) {
        //this.client.trackTrace({ message: logResponse });
      }
    });

    next();
  }
}
