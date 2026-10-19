import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('amar_theme') || 'aurora-night');
  const [isDark, setIsDark] = useState(localStorage.getItem('amar_is_dark') !== 'false');

  useEffect(() => {
    localStorage.setItem('amar_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('amar_is_dark', isDark);
    document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
