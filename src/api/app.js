const express = require("express");
const corsMiddleware = require("./middlewares/corsMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const asyncMiddleware = require("./middlewares/asyncMiddleware");
const validateMiddleware = require("./middlewares/validateMiddleware");
const CategRoutes = require("./routes/CategRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const PredprRoutes = require("./routes/PredprRoutes");
const ProdRoutes = require("./routes/ProdRoutes");
const SkladRoutes = require("./routes/SkladRouter");
const SpecRoutes = require("./routes/SpecRoutes");

const app = express();

app.use(corsMiddleware); // Применяем CORS мидлвар
app.use(express.json()); // Для обработки JSON в запросах

// Подключение маршрутов с валидацией
app.use("/api/categ", asyncMiddleware(CategRoutes)); // Категории
app.use("/api/order", asyncMiddleware(OrderRoutes)); // Заказы
app.use("/api/predpr", asyncMiddleware(PredprRoutes)); // Организации
app.use("/api/prod", asyncMiddleware(ProdRoutes)); // Продукты
app.use("/api/sklad", asyncMiddleware(SkladRoutes)); // Склады
app.use("/api/spec", asyncMiddleware(SpecRoutes)); // Спецификации

// Применение валидации для POST/PUT запросов
app.post("/api/order", validateMiddleware("order"), asyncMiddleware(OrderRoutes)); // Валидация для POST на заказ
app.put("/api/order/:id", validateMiddleware("order"), asyncMiddleware(OrderRoutes)); // Валидация для PUT на заказ

// Подключаем обработчик ошибок, он должен быть последним
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
