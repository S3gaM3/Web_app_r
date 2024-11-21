const express = require("express");
const { validateProdData } = require("../validators"); // Валидация данных продукта
const { db } = require("../database"); // Подключение базы данных
const asyncMiddleware = require("../middlewares/asyncMiddleware"); // Асинхронная обработка ошибок

const router = express.Router();

// Получение всех продуктов
router.get("/", asyncMiddleware(async (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id, 
      p.name AS product_name, 
      p.price, 
      c.name AS category_name
    FROM 
      prod p
    LEFT JOIN 
      categ c ON p.categ_id = c.id
    ORDER BY p.id;
  `;

  const [rows] = await db.query(query);
  res.status(200).json(rows);
}));

// Добавление нового продукта
router.post("/", asyncMiddleware(async (req, res) => {
  const { name, price, categ_id } = req.body;

  // Валидация данных
  const validationError = validateProdData(name, price, categ_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Добавление продукта
  const [result] = await db.query("INSERT INTO prod (name, price, categ_id) VALUES (?, ?, ?)", [name, price, categ_id]);
  res.status(201).json({ id: result.insertId, name, price, categ_id });
}));

// Обновление существующего продукта
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, price, categ_id } = req.body;

  // Валидация данных
  const validationError = validateProdData(name, price, categ_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования продукта
  const [existingProd] = await db.query("SELECT * FROM prod WHERE id = ?", [id]);
  if (existingProd.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Обновление продукта
  await db.query("UPDATE prod SET name = ?, price = ?, categ_id = ? WHERE id = ?", [name, price, categ_id, id]);
  res.status(200).json({ message: "Product updated successfully" });
}));

// Удаление продукта
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  // Проверка существования продукта
  const [existingProd] = await db.query("SELECT * FROM prod WHERE id = ?", [id]);
  if (existingProd.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Удаление продукта
  await db.query("DELETE FROM prod WHERE id = ?", [id]);
  res.status(200).json({ message: "Product deleted successfully" });
}));

module.exports = router;
