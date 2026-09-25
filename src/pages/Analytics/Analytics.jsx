import React, { useState } from "react";
import styles from "./Analytics.module.css";

function Analytics() {
  const [period, setPeriod] = useState("month");

  const periods = [
    { id: "week", label: "Неделя" },
    { id: "month", label: "Месяц" },
    { id: "quarter", label: "Квартал" },
    { id: "year", label: "Год" },
  ];

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
      </div>

      <div className={styles.periodSelector}>
        {periods.map((p) => (
          <button
            key={p.id}
            className={`${styles.periodButton} ${
              period === p.id ? styles.periodButtonActive : ""
            }`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chartPlaceholder}>
              <div className={styles.chartPlaceholderIcon}>📊</div>
              <p className={styles.chartPlaceholderText}>
                Графики появятся после подключения данных
              </p>
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chartPlaceholder}>
              <div className={styles.chartPlaceholderIcon}>📈</div>
              <p className={styles.chartPlaceholderText}>
                Графики появятся после подключения данных
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>Сводка за период</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Общие доходы</span>
            <span
              className={`${styles.summaryValue} ${styles.summaryValueIncome}`}
            >
              0 ₽
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Общие расходы</span>
            <span
              className={`${styles.summaryValue} ${styles.summaryValueExpense}`}
            >
              0 ₽
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Баланс</span>
            <span
              className={`${styles.summaryValue} ${styles.summaryValueBalance}`}
            >
              0 ₽
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
