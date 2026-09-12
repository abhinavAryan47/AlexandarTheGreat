import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_DIR: process.env.DATA_DIR 
    ? path.resolve(process.cwd(), process.env.DATA_DIR)
    : path.resolve(process.cwd(), 'data'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  NVIDIA_NIM_BASE_URL: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  NVIDIA_NIM_API_KEY: process.env.NVIDIA_NIM_API_KEY || '',
  NVIDIA_NIM_MODEL: process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.2-11b-vision-instruct',
  GOOGLE_CALENDAR_CREDENTIALS: process.env.GOOGLE_CALENDAR_CREDENTIALS || ''
};
