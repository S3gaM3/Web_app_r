// middlewares/corsMiddleware.js

const cors = require("cors");

const corsMiddleware = cors({
  origin: "*", // Разрешить доступ с любого домена
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
});

module.exports = corsMiddleware;
