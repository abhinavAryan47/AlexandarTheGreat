import { Response } from 'express';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    const payload: ApiSuccessResponse<T> = {
      success: true,
      data
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    code: string,
    message: string,
    statusCode: number = 400,
    details?: unknown
  ): Response {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      }
    };
    return res.status(statusCode).json(payload);
  }
}
