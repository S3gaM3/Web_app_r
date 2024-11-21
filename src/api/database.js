const mysql = require("mysql2/promise");

// Конфигурация подключения к базе данных
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Тест соединения
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Завершаем процесс при ошибке подключения
  }
})();

module.exports = { db };
