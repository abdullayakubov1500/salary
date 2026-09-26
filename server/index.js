import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port;

// Запускаем сервер
app.listen(PORT, () => {
  console.log('🚀 ==================================');
  console.log(`✅ Salary Tracker API запущен`);
  console.log(`📍 Порт: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/v1`);
  console.log('🚀 ==================================');
});

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанный отказ промиса:', reason);
  process.exit(1);
});