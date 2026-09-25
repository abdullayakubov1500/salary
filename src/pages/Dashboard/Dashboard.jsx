import React from "react";
import styles from "./Dashboard.module.css";

// Временная заглушка карточки баланса — будет заменена на BalanceCard в шаге D2
const BalanceCardPlaceholder = ({ title, amount, color }) => (
  <div
    style={{
      backgroundColor: "var(--color-surface)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--spacing-lg)",
      boxShadow: "var(--shadow-sm)",
      borderLeft: `4px solid ${color}`,
    }}
  >
    <p
      style={{
        color: "var(--color-text-muted)",
        fontSize: "var(--font-size-sm)",
        marginBottom: "var(--spacing-xs)",
      }}
    >
      {title}
    </p>
    <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color }}>
      {amount ?? 0} ₽
    </p>
  </div>
);

// Временная заглушка пустого состояния — будет заменена на EmptyState в шаге D6
const EmptyStatePlaceholder = () => (
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
      📭
    </p>
    <p style={{ fontSize: "var(--font-size-lg)", fontWeight: 500 }}>
      Пока нет операций
    </p>
    <p style={{ marginTop: "var(--spacing-sm)" }}>
      Добавьте первую запись, нажав кнопку «+»
    </p>
  </div>
);

function Dashboard() {
  // Заглушки данных — будут подключены в фазе F
  const totalIncome = 0;
  const totalExpense = 0;
  const balance = 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обзор</h1>
        <button className={styles.addButton}>
          <span className={styles.addIcon}>+</span>
          Добавить операцию
        </button>
      </div>

      <div className={styles.balanceGrid}>
        <BalanceCardPlaceholder
          title="Доходы"
          amount={totalIncome}
          color="var(--color-income)"
        />
        <BalanceCardPlaceholder
          title="Расходы"
          amount={totalExpense}
          color="var(--color-expense)"
        />
        <BalanceCardPlaceholder
          title="Баланс"
          amount={balance}
          color="var(--color-balance)"
        />
      </div>

      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <EmptyStatePlaceholder />
      </div>
    </div>
  );
}

export default Dashboard;
