import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { v4 as uuid } from 'uuid';

export const correlationId = 'X-Correlation-Id';
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = uuid();
    req[correlationId] = id;
    res.set(correlationId, id);
    next();
  }
}
