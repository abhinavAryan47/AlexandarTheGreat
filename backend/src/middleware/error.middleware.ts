import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../utils/api-response';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle JSON body parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    ApiResponse.error(
      res,
      'INVALID_JSON',
      'Malformed JSON in request body',
      400
    );
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));

    ApiResponse.error(
      res,
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      details
    );
    return;
  }

  // Handle custom status errors
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');

  console.error(`[ErrorMiddleware] ${code} (${statusCode}):`, err);

  ApiResponse.error(res, code, message, statusCode);
};
