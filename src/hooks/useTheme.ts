import { useState, useEffect, useCallback } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('light-mode');

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    document.body.className = newTheme;
  }, [theme]);

  useEffect(() => {
    const defaultTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
    setTheme(defaultTheme);
    document.body.className = defaultTheme;
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;