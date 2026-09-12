import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { notFoundHandler } from './middleware/not-found.middleware';
import { errorHandler } from './middleware/error.middleware';
import { ApiResponse } from './utils/api-response';
import { ENV } from './config/env';

export const createApp = (): Express => {
  const app = express();

  // CORS configuration for frontend
  app.use(
    cors({
      origin: ENV.CORS_ORIGIN === '*' ? true : ENV.CORS_ORIGIN.split(','),
      credentials: true
    })
  );

  // Parse JSON bodies
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    ApiResponse.success(res, {
      status: 'ok',
      service: 'AlexandarTheGreat Backend'
    });
  });

  // Mount API endpoints
  app.use('/api', apiRouter);

  // 404 Handler for undefined routes
  app.use(notFoundHandler);

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
