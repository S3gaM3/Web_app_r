const express = require("express");
const { validateSkladData } = require("../validators"); // Валидация данных склада
const { db } = require("../database"); // Подключение базы данных
const asyncMiddleware = require("../middlewares/asyncMiddleware"); // Асинхронная обработка ошибок

const router = express.Router();

// Получение всех записей склада с наименованиями продуктов
router.get("/", asyncMiddleware(async (req, res) => {
  const query = `
    SELECT 
      sklad.id AS sklad_id,
      prod.name AS product_name,
      sklad.kol AS quantity,
      sklad.date_in
    FROM 
      sklad
    JOIN 
      prod ON sklad.prod_id = prod.id
    ORDER BY sklad.id;
  `;
  const [rows] = await db.query(query);
  res.status(200).json(rows);
}));

// Добавление новой записи в склад
router.post("/", asyncMiddleware(async (req, res) => {
  const { prod_id, kol, date_in } = req.body;

  // Валидация данных
  const validationError = validateSkladData(prod_id, kol, date_in);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования продукта
  const [product] = await db.query("SELECT name FROM prod WHERE id = ?", [prod_id]);
  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Добавление записи в склад
  const [result] = await db.query("INSERT INTO sklad (prod_id, kol, date_in) VALUES (?, ?, ?)", [prod_id, kol, date_in]);
  res.status(201).json({ 
    id: result.insertId, 
    prod_id, 
    product_name: product[0].name, 
    kol, 
    date_in 
  });
}));

// Обновление записи склада
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { prod_id, kol, date_in } = req.body;

  // Валидация данных
  const validationError = validateSkladData(prod_id, kol, date_in);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования записи склада
  const [existingSklad] = await db.query("SELECT * FROM sklad WHERE id = ?", [id]);
  if (existingSklad.length === 0) {
    return res.status(404).json({ error: "Sklad record not found" });
  }

  // Проверка существования продукта
  const [product] = await db.query("SELECT name FROM prod WHERE id = ?", [prod_id]);
  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Обновление записи склада
  await db.query("UPDATE sklad SET prod_id = ?, kol = ?, date_in = ? WHERE id = ?", [prod_id, kol, date_in, id]);
  res.status(200).json({ 
    id, 
    prod_id, 
    product_name: product[0].name, 
    kol, 
    date_in 
  });
}));

// Удаление записи со склада
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  // Проверка существования записи склада
  const [existingSklad] = await db.query("SELECT prod_id FROM sklad WHERE id = ?", [id]);
  if (existingSklad.length === 0) {
    return res.status(404).json({ error: "Sklad record not found" });
  }

  // Получение информации о продукте
  const [product] = await db.query("SELECT name FROM prod WHERE id = ?", [existingSklad[0].prod_id]);
  await db.query("DELETE FROM sklad WHERE id = ?", [id]);

  res.status(200).json({ message: `Product ${product[0].name} removed from sklad.` });
}));

module.exports = router;
