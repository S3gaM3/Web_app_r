import React from "react";
import { Box, Typography, Stack, Button, Tooltip } from "@mui/material";

function Navigation({ activeTable, setActiveTable, navItems }) {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        bgcolor: "background.paper",
        zIndex: 1000,
        boxShadow: 1,
        py: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ textAlign: "center", width: "100%" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Адаптивный размер шрифта
          }}
        >
          Управление базой данных
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }} // В мобильной версии в столбик, в остальных — в ряд
          spacing={2}
          justifyContent="center"
          mt={1}
          sx={{
            flexWrap: "wrap", // Чтобы элементы не выходили за пределы экрана
            width: "100%",
            justifyContent: { xs: "center", sm: "center" }, // В мобильной версии по центру, на больших экранах слева
          }}
        >
          {navItems.map(({ id, label, icon }) => (
            <Tooltip key={id} title={label} arrow>
              <Button
                variant={activeTable === id ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActiveTable(id)}
                startIcon={icon}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)", // Анимация при наведении
                  },
                  fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // Размер шрифта для кнопок
                  py: { xs: 1, sm: 1.5 }, // Паддинг для кнопок на мобильных и больших экранах
                  px: { xs: 2, sm: 3 },
                  minWidth: "auto", // Убираем фиксированную ширину
                }}
                aria-label={label} // Атрибут для улучшения доступности
              >
                {label}
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default Navigation;
