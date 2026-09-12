import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response';

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  ApiResponse.error(
    res,
    'NOT_FOUND',
    `Resource not found: ${req.method} ${req.originalUrl}`,
    404
  );
};
