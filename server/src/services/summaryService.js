import db from '../db/connection.js';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

/**
 * Получение общего баланса (доходы, расходы, разница)
 * @param {string} startDate - Начальная дата фильтра (опционально)
 * @param {string} endDate - Конечная дата фильтра (опционально)
 * @returns {Object} Объект с totalIncome, totalExpense, balance
 */
export const getBalance = (startDate, endDate) => {
  const conditions = [];
  const params = [];

  if (startDate) {
    conditions.push('date >= ?');
    params.push(startDate);
  }

  if (endDate) {
    conditions.push('date <= ?');
    params.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Сумма доходов
  const incomeQuery = `SELECT COALESCE(SUM(amount), 0) as total FROM incomes ${whereClause}`;
  const { total: totalIncome } = db.prepare(incomeQuery).get(...params);

  // Сумма расходов
  const expenseQuery = `SELECT COALESCE(SUM(amount), 0) as total FROM expenses ${whereClause}`;
  const { total: totalExpense } = db.prepare(expenseQuery).get(...params);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

/**
 * Получение сумм по категориям для круговой диаграммы
 * @param {string} type - Тип операции ('income' или 'expense')
 * @param {string} startDate - Начальная дата фильтра (опционально)
 * @param {string} endDate - Конечная дата фильтра (опционально)
 * @returns {Array} Массив объектов [{ categoryId, categoryLabel, total }]
 */
export const getByCategory = (type = 'expense', startDate, endDate) => {
  const table = type === 'income' ? 'incomes' : 'expenses';
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const conditions = [];
  const params = [];

  if (startDate) {
    conditions.push('date >= ?');
    params.push(startDate);
  }

  if (endDate) {
    conditions.push('date <= ?');
    params.push(endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT category, SUM(amount) as total
    FROM ${table}
    ${whereClause}
    GROUP BY category
    ORDER BY total DESC
  `;

  const rows = db.prepare(query).all(...params);

  // Маппим результаты, добавляя названия категорий из констант
  return rows.map((row) => {
    const categoryInfo = categories.find((cat) => cat.id === row.category);
    return {
      categoryId: row.category,
      categoryLabel: categoryInfo ? categoryInfo.label : row.category,
      total: row.total,
    };
  });
};

/**
 * Получение помесячной сводки доходов и расходов
 * @param {number} monthsCount - Количество последних месяцев (по умолчанию 6)
 * @returns {Array} Массив объектов [{ month, year, income, expense }]
 */
export const getByMonth = (monthsCount = 6) => {
  // Вычисляем дату начала периода
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1);
  const startDateStr = startDate.toISOString().split('T')[0];

  // Доходы по месяцам
  const incomeQuery = `
    SELECT 
      strftime('%Y', date) as year,
      strftime('%m', date) as month,
      SUM(amount) as total
    FROM incomes
    WHERE date >= ?
    GROUP BY year, month
    ORDER BY year, month
  `;

  const incomeRows = db.prepare(incomeQuery).all(startDateStr);

  // Расходы по месяцам
  const expenseQuery = `
    SELECT 
      strftime('%Y', date) as year,
      strftime('%m', date) as month,
      SUM(amount) as total
    FROM expenses
    WHERE date >= ?
    GROUP BY year, month
    ORDER BY year, month
  `;

  const expenseRows = db.prepare(expenseQuery).all(startDateStr);

  // Объединяем результаты в единый массив
  const monthMap = {};

  incomeRows.forEach((row) => {
    const key = `${row.year}-${row.month}`;
    if (!monthMap[key]) {
      monthMap[key] = { year: Number(row.year), month: Number(row.month), income: 0, expense: 0 };
    }
    monthMap[key].income = row.total;
  });

  expenseRows.forEach((row) => {
    const key = `${row.year}-${row.month}`;
    if (!monthMap[key]) {
      monthMap[key] = { year: Number(row.year), month: Number(row.month), income: 0, expense: 0 };
    }
    monthMap[key].expense = row.total;
  });

  // Сортируем по году и месяцу
  return Object.values(monthMap).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};