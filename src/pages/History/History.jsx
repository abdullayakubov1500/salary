import React, { useState } from "react";
import styles from "./History.module.css";

// Временная заглушка списка транзакций — будет заменена на TransactionList в шаге D8
const TransactionListPlaceholder = () => (
  <div
    style={{
      textAlign: "center",
      padding: "var(--spacing-2xl)",
      color: "var(--color-text-muted)",
    }}
  >
    <p
      style={{
        fontSize: "var(--font-size-3xl)",
        marginBottom: "var(--spacing-md)",
      }}
    >
      📋
    </p>
    <p style={{ fontSize: "var(--font-size-lg)", fontWeight: 500 }}>
      Нет операций
    </p>
    <p style={{ marginTop: "var(--spacing-sm)" }}>
      Добавьте первую операцию, чтобы увидеть её здесь
    </p>
  </div>
);

function History() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
        <button className={styles.addButton}>
          <span className={styles.addIcon}>+</span>
          Добавить операцию
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            <option value="salary">Зарплата</option>
            <option value="freelance">Подработка</option>
            <option value="groceries">Продукты</option>
            <option value="utilities">Коммуналка</option>
          </select>
        </div>
      </div>

      <div className={styles.listContainer}>
        <TransactionListPlaceholder />
      </div>
    </div>
  );
}

export default History;
