import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

// Получаем директорию текущего модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаём директорию для базы данных, если её нет
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Инициализируем подключение к базе данных
const db = new Database(config.dbPath);

// Включаем режим WAL для лучшей производительности
db.pragma('journal_mode = WAL');

// Читаем и выполняем SQL-скрипт для создания таблиц
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('✅ База данных инициализирована успешно');

export default db;