// components/ThemeSwitch.jsx
import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material'; // Иконки для переключения

export default function ThemeSwitch({ toggleTheme, darkMode }) {
  return (
    <IconButton
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        backgroundColor: 'background.paper',
        boxShadow: 3,
        zIndex: 1100,
      }}
      onClick={toggleTheme}
    >
      {/* Используем условный рендеринг и меняем иконки в зависимости от текущего состояния */}
      {darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
