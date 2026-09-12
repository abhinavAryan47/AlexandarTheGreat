import { app } from './app';
import { ENV } from './config/env';

const server = app.listen(ENV.PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 AlexandarTheGreat Backend (Phase 1) is running`);
  console.log(`📡 URL: http://localhost:${ENV.PORT}`);
  console.log(`🏥 Health Check: http://localhost:${ENV.PORT}/health`);
  console.log(`📂 Data Storage: ${ENV.DATA_DIR}`);
  console.log(`🌱 Environment: ${ENV.NODE_ENV}`);
  console.log(`==================================================`);
});

export default server;
