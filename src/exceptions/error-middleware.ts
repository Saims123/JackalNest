import { NextFunction, Request, Response } from 'express';
import HttpException from './http-exception';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || 'Encounter error';
  response.status(status).send({
    status,
    message
  });
}

export default errorMiddleware;
