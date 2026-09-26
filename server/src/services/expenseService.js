import crypto from 'crypto';
import db from '../db/connection.js';

/**
 * Преобразование записи из БД (snake_case) в формат JSON (camelCase)
 */
const mapExpenseToJSON = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment || '',
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Получение всех расходов с опциональными фильтрами и пагинацией
 * @param {Object} options - Опции запроса
 * @param {string} options.category - Фильтр по категории
 * @param {string} options.startDate - Фильтр по начальной дате (YYYY-MM-DD)
 * @param {string} options.endDate - Фильтр по конечной дате (YYYY-MM-DD)
 * @param {boolean} options.isRecurring - Фильтр по признаку регулярности
 * @param {number} options.page - Номер страницы (по умолчанию 1)
 * @param {number} options.limit - Количество записей на странице (по умолчанию 20)
 * @returns {Object} Объект с данными и метаинформацией
 */
export const getAllExpenses = (options = {}) => {
  const { category, startDate, endDate, isRecurring, page = 1, limit = 20 } = options;

  // Строим динамический WHERE
  const conditions = [];
  const params = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (startDate) {
    conditions.push('date >= ?');
    params.push(startDate);
  }

  if (endDate) {
    conditions.push('date <= ?');
    params.push(endDate);
  }

  if (isRecurring !== undefined) {
    conditions.push('is_recurring = ?');
    params.push(isRecurring ? 1 : 0);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Получаем общее количество записей
  const countQuery = `SELECT COUNT(*) as total FROM expenses ${whereClause}`;
  const { total } = db.prepare(countQuery).get(...params);

  // Получаем данные с пагинацией
  const offset = (page - 1) * limit;
  const dataQuery = `
    SELECT * FROM expenses 
    ${whereClause}
    ORDER BY date DESC, created_at DESC
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(dataQuery).all(...params, limit, offset);

  return {
    data: rows.map(mapExpenseToJSON),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Получение расхода по ID
 * @param {string} id - Идентификатор расхода
 * @returns {Object|null} Объект расхода или null
 */
export const getExpenseById = (id) => {
  const row = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  return mapExpenseToJSON(row);
};

/**
 * Создание нового расхода
 * @param {Object} data - Данные расхода
 * @returns {Object} Созданный расход
 */
export const createExpense = (data) => {
  const { amount, date, category, comment = '', isRecurring = false } = data;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const query = `
    INSERT INTO expenses (id, amount, date, category, comment, is_recurring, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(query).run(id, amount, date, category, comment, isRecurring ? 1 : 0, now, now);

  return getExpenseById(id);
};

/**
 * Обновление существующего расхода
 * @param {string} id - Идентификатор расхода
 * @param {Object} data - Новые данные
 * @returns {Object|null} Обновлённый расход или null
 */
export const updateExpense = (id, data) => {
  const existing = getExpenseById(id);
  if (!existing) return null;

  const { amount, date, category, comment, isRecurring } = data;
  const now = new Date().toISOString();

  const query = `
    UPDATE expenses
    SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = ?
    WHERE id = ?
  `;

  db.prepare(query).run(
    amount ?? existing.amount,
    date ?? existing.date,
    category ?? existing.category,
    comment ?? existing.comment,
    isRecurring !== undefined ? (isRecurring ? 1 : 0) : (existing.isRecurring ? 1 : 0),
    now,
    id
  );

  return getExpenseById(id);
};

/**
 * Удаление расхода
 * @param {string} id - Идентификатор расхода
 * @returns {boolean} true, если удалён успешно
 */
export const deleteExpense = (id) => {
  const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  return result.changes > 0;
};