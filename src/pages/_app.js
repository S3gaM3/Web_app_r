// _app.js
import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'; // Импортируем MUI компоненты
import { SnackbarProvider } from '../app/components/SnackbarProvider'; // Компонент для уведомлений
import ThemeSwitch from '../app/components/ThemeSwitch'; // Компонент для переключения темы
import "@/app/colors.css"; // Подключаем стили для светлой и темной темы

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  // Загружаем сохраненную тему из localStorage при монтировании компонента
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Сохраняем состояние темы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Создаем тему с учетом состояния darkMode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Устанавливаем темную или светлую тему
    },
  });

  // Функция для переключения темы
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Применяем глобальные стили MUI */}
        <Component {...pageProps} />
        <ThemeSwitch toggleTheme={toggleTheme} darkMode={darkMode} /> {/* Переключатель темы */}
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
