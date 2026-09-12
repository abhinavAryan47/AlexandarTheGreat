import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../utils/api-response';

type RequestLocation = 'body' | 'query' | 'params';

export const validateRequest = (
  schema: AnyZodObject,
  location: RequestLocation = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync(req[location]);
      req[location] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        ApiResponse.error(
          res,
          'VALIDATION_ERROR',
          `Invalid request ${location}`,
          400,
          details
        );
        return;
      }
      next(error);
    }
  };
};
