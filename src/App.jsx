import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';

// Временные заглушки — будут заменены на реальные компоненты в следующих шагах
const LayoutPlaceholder = ({ children }) => (
  <div className={styles.app}>
    <header style={{ padding: 'var(--spacing-md)', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      Header (будет добавлен в шаге B4)
    </header>
    <main style={{ flex: 1, padding: 'var(--spacing-lg)', maxWidth: 'var(--container-max-width)', margin: '0 auto', width: '100%' }}>
      {children}
    </main>
  </div>
);

const DashboardPlaceholder = () => (
  <div>
    <h2>Dashboard</h2>
    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)' }}>
      Страница будет добавлена в шаге C2
    </p>
  </div>
);

const HistoryPlaceholder = () => (
  <div>
    <h2>History</h2>
    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)' }}>
      Страница будет добавлена в шаге C4
    </p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div>
    <h2>Analytics</h2>
    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)' }}>
      Страница будет добавлена в шаге C6
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={
            <LayoutPlaceholder>
              <DashboardPlaceholder />
            </LayoutPlaceholder>
          } />
          <Route path="/history" element={
            <LayoutPlaceholder>
              <HistoryPlaceholder />
            </LayoutPlaceholder>
          } />
          <Route path="/analytics" element={
            <LayoutPlaceholder>
              <AnalyticsPlaceholder />
            </LayoutPlaceholder>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;