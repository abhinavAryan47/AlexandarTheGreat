import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_DIR: process.env.DATA_DIR 
    ? path.resolve(process.cwd(), process.env.DATA_DIR)
    : path.resolve(process.cwd(), 'data'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
