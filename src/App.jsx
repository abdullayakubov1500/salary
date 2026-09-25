import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import styles from "./App.module.css";

import Dashboard from "./pages/Dashboard/Dashboard";

const HistoryPlaceholder = () => (
  <div>
    <h2>История</h2>
    <p
      style={{
        color: "var(--color-text-muted)",
        marginTop: "var(--spacing-sm)",
      }}
    >
      Страница будет добавлена в шаге C4
    </p>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div>
    <h2>Аналитика</h2>
    <p
      style={{
        color: "var(--color-text-muted)",
        marginTop: "var(--spacing-sm)",
      }}
    >
      Страница будет добавлена в шаге C6
    </p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="history" element={<HistoryPlaceholder />} />
            <Route path="analytics" element={<AnalyticsPlaceholder />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
