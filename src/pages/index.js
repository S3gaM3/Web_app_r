import React, { useState } from "react";
import { Box, Typography, Grid2 } from "@mui/material";
import { Home, Category, ShoppingCart, Business, LocalMall, Store } from "@mui/icons-material";
import { useSnackbar } from "../app/components/SnackbarProvider";
import ThemeSwitch from "../app/components/ThemeSwitch";
import CategoryList from "../app/components/CategoryList";
import OrderList from "../app/components/OrderList";
import PredprList from "../app/components/PredprList";
import ProdList from "../app/components/ProdList";
import SkladList from "../app/components/SkladList";
import Cart from "../app/components/Cart";
import Navigation from "../app/components/Navigation";

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

  const ActiveComponent = NAV_ITEMS.find((item) => item.id === activeTable)?.component || null;

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
      <Navigation activeTable={activeTable} setActiveTable={setActiveTable} navItems={NAV_ITEMS} />

      <ThemeSwitch toggleTheme={() => setDarkMode((prev) => !prev)} darkMode={darkMode} />

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
        <Box sx={{ width: { xs: "95%", md: "80%" } }}>
          <Grid2 container spacing={2} justifyContent="center">
            {ActiveComponent ? <ActiveComponent showSnackbar={showSnackbar} /> : <Typography>Выберите таблицу для просмотра</Typography>}
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
}
