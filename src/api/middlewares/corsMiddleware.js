const cors = require("cors");

const corsMiddleware = cors({
  origin: "*", // Разрешает доступ с любого домена (для продакшн-системы можно уточнить конкретные домены)
  methods: "GET,POST,PUT,DELETE", // Разрешенные HTTP-методы
  allowedHeaders: "Content-Type,Authorization", // Разрешенные заголовки
});

module.exports = corsMiddleware;
