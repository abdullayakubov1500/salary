import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Временная заглушка до создания App.jsx
const AppPlaceholder = () => (
  <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
    <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>
      Salary Tracker
    </h1>
    <p style={{ color: 'var(--color-text-muted)' }}>
      Глобальные стили успешно применены
    </p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppPlaceholder />
  </React.StrictMode>
);