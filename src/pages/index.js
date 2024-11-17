import React, { useState } from "react";
import { Grid2, Button, Typography, IconButton, Stack, Box } from "@mui/material";
import { Category, ShoppingCart, Business, LocalMall, Home } from "@mui/icons-material";
import CategoryList from "../app/components/CategoryList";
import OrderList from "../app/components/OrderList";
import PredprList from "../app/components/PredprList";
import ProdList from "../app/components/ProdList";
import SpecList from "../app/components/SpecList";
import { useSnackbar } from "../app/components/SnackbarProvider"; // Импортируем контекст

export default function HomePage() {
  const [activeTable, setActiveTable] = useState("categ");
  const { showSnackbar } = useSnackbar(); // Получаем функцию для отображения уведомлений

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        zIndex: 1000,
        padding: "10px 0",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1">
            Управление базой данных
          </Typography>
          <nav>
            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton color="primary" onClick={() => setActiveTable("home")} aria-label="home">
                <Home />
              </IconButton>
              <Button
                variant={activeTable === "categ" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActiveTable("categ")}
                startIcon={<Category />}
              >
                Категории
              </Button>
              <Button
                variant={activeTable === "order" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActiveTable("order")}
                startIcon={<ShoppingCart />}
              >
                Заказы
              </Button>
              <Button
                variant={activeTable === "predpr" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActiveTable("predpr")}
                startIcon={<Business />}
              >
                Предприятия
              </Button>
              <Button
                variant={activeTable === "prod" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActiveTable("prod")}
                startIcon={<LocalMall />}
              >
                Продукция
              </Button>
              <Button
                variant={activeTable === "spec" ? "contained" : "outlined"}
                color="primary"
                onClick={() => setActiveTable("spec")}
                startIcon={<LocalMall />}
              >
                Спецификации
              </Button>
            </Stack>
          </nav>
        </Box>
      </header>

      <main style={{ width: "100%", paddingTop: "160px" }}>
        <div id="content" style={{ width: "80%", margin: "0 auto" }}>
          <Grid2 container spacing={2} justifyContent="center">
            {activeTable === "categ" && <CategoryList showSnackbar={showSnackbar} />}
            {activeTable === "order" && <OrderList showSnackbar={showSnackbar} />}
            {activeTable === "predpr" && <PredprList showSnackbar={showSnackbar} />}
            {activeTable === "prod" && <ProdList showSnackbar={showSnackbar} />}
            {activeTable === "spec" && <SpecList showSnackbar={showSnackbar} />}
          </Grid2>
        </div>
      </main>
    </Box>
  );
}
