import React, { useState, useMemo } from "react";
import { Box, Button, Typography, Stack, Grid2, Tooltip } from "@mui/material";
import { Category, ShoppingCart, Business, LocalMall, Home, Store } from "@mui/icons-material";
import CategoryList from "../app/components/CategoryList";
import OrderList from "../app/components/OrderList";
import PredprList from "../app/components/PredprList";
import ProdList from "../app/components/ProdList";
import SpecList from "../app/components/SpecList";
import SkladList from "../app/components/SkladList";
import { useSnackbar } from "../app/components/SnackbarProvider";
import ThemeSwitch from "../app/components/ThemeSwitch";
import Cart from "../app/components/Cart"; // Импортируем компонент корзины

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: <Home />, component: null },
  { id: "categ", label: "Категории", icon: <Category />, component: CategoryList },
  { id: "order", label: "Заказы", icon: <ShoppingCart />, component: OrderList },
  { id: "predpr", label: "Предприятия", icon: <Business />, component: PredprList },
  { id: "prod", label: "Продукция", icon: <LocalMall />, component: ProdList },
  { id: "sklad", label: "Склад", icon: <Store />, component: SkladList },
  { id: "cart", label: "Корзина", icon: <ShoppingCart />, component: Cart },
];

export default function HomePage() {
  const [activeTable, setActiveTable] = useState("home");
  const { showSnackbar } = useSnackbar();
  const [darkMode, setDarkMode] = useState(false);

  // Переключение темы
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Рендеринг активного компонента
  const ActiveComponent = useMemo(
    () => NAV_ITEMS.find((item) => item.id === activeTable)?.component || null,
    [activeTable]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: darkMode ? "background.default" : "background.paper",
        color: darkMode ? "text.primary" : "text.secondary",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
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
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1">
            Управление базой данных
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
            {NAV_ITEMS.map(({ id, label, icon }) => (
              <Tooltip key={id} title={label} arrow>
                <Button
                  variant={activeTable === id ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setActiveTable(id)}
                  startIcon={icon}
                >
                  {label}
                </Button>
              </Tooltip>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Theme Switch */}
      <ThemeSwitch toggleTheme={toggleTheme} darkMode={darkMode} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          width: "100%",
          flexGrow: 1,
          pt: "160px",
          px: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Grid2 container spacing={2} justifyContent="center">
            {ActiveComponent ? <ActiveComponent showSnackbar={showSnackbar} /> : <Typography>Выберите таблицу для просмотра</Typography>}
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
}
