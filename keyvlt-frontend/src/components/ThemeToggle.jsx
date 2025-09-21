// src/components/ThemeToggle.jsx
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const toggleStyle = {
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: 'var(--text-secondary)',
};

function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div style={{ marginTop: 'auto', paddingTop: '2rem' }} onClick={toggleTheme}>
      {theme === 'light' ? (
        <FiMoon style={toggleStyle} title="Activate Dark Mode" />
      ) : (
        <FiSun style={toggleStyle} title="Activate Light Mode" />
      )}
    </div>
  );
}

export default ThemeToggle;