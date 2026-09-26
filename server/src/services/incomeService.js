import crypto from 'crypto';
import db from '../db/connection.js';

/**
 * Преобразование записи из БД (snake_case) в формат JSON (camelCase)
 */
const mapIncomeToJSON = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Получение всех доходов с опциональными фильтрами и пагинацией
 * @param {Object} options - Опции запроса
 * @param {string} options.category - Фильтр по категории
 * @param {string} options.startDate - Фильтр по начальной дате (YYYY-MM-DD)
 * @param {string} options.endDate - Фильтр по конечной дате (YYYY-MM-DD)
 * @param {number} options.page - Номер страницы (по умолчанию 1)
 * @param {number} options.limit - Количество записей на странице (по умолчанию 20)
 * @returns {Object} Объект с данными и метаинформацией
 */
export const getAllIncomes = (options = {}) => {
  const { category, startDate, endDate, page = 1, limit = 20 } = options;

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

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Получаем общее количество записей
  const countQuery = `SELECT COUNT(*) as total FROM incomes ${whereClause}`;
  const { total } = db.prepare(countQuery).get(...params);

  // Получаем данные с пагинацией
  const offset = (page - 1) * limit;
  const dataQuery = `
    SELECT * FROM incomes 
    ${whereClause}
    ORDER BY date DESC, created_at DESC
    LIMIT ? OFFSET ?
  `;

  const rows = db.prepare(dataQuery).all(...params, limit, offset);

  return {
    data: rows.map(mapIncomeToJSON),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Получение дохода по ID
 * @param {string} id - Идентификатор дохода
 * @returns {Object|null} Объект дохода или null
 */
export const getIncomeById = (id) => {
  const row = db.prepare('SELECT * FROM incomes WHERE id = ?').get(id);
  return mapIncomeToJSON(row);
};

/**
 * Создание нового дохода
 * @param {Object} data - Данные дохода
 * @returns {Object} Созданный доход
 */
export const createIncome = (data) => {
  const { amount, date, category, comment = '' } = data;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const query = `
    INSERT INTO incomes (id, amount, date, category, comment, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(query).run(id, amount, date, category, comment, now, now);

  return getIncomeById(id);
};

/**
 * Обновление существующего дохода
 * @param {string} id - Идентификатор дохода
 * @param {Object} data - Новые данные
 * @returns {Object|null} Обновлённый доход или null
 */
export const updateIncome = (id, data) => {
  const existing = getIncomeById(id);
  if (!existing) return null;

  const { amount, date, category, comment } = data;
  const now = new Date().toISOString();

  const query = `
    UPDATE incomes
    SET amount = ?, date = ?, category = ?, comment = ?, updated_at = ?
    WHERE id = ?
  `;

  db.prepare(query).run(
    amount ?? existing.amount,
    date ?? existing.date,
    category ?? existing.category,
    comment ?? existing.comment,
    now,
    id
  );

  return getIncomeById(id);
};

/**
 * Удаление дохода
 * @param {string} id - Идентификатор дохода
 * @returns {boolean} true, если удалён успешно
 */
export const deleteIncome = (id) => {
  const result = db.prepare('DELETE FROM incomes WHERE id = ?').run(id);
  return result.changes > 0;
};