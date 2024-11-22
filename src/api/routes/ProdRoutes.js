// prodRouter.js 
const express = require("express");
const { validateProdData } = require("../validators");  // Импортируем валидатор для данных
const { db } = require("../database");  // Подключение к базе данных
const asyncMiddleware = require("../middlewares/asyncMiddleware");  // Асинхронный middleware

const router = express.Router();

// Получение всех продуктов
router.get("/", asyncMiddleware(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM prod");
  res.json(rows);
}));

// Добавление нового продукта
router.post("/", asyncMiddleware(async (req, res) => {
  const { name, price, categ_id } = req.body;
  const validationError = validateProdData(name, price, categ_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const [result] = await db.query("INSERT INTO prod (name, price, categ_id) VALUES (?, ?, ?)", [name, price, categ_id]);
  res.status(201).json({ id: result.insertId, name, price, categ_id });
}));

// Обновление существующего продукта
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, price, categ_id } = req.body;
  const validationError = validateProdData(name, price, categ_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await db.query("UPDATE prod SET name = ?, price = ?, categ_id = ? WHERE id = ?", [name, price, categ_id, id]);
  res.sendStatus(200);
}));

// Удаление продукта
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM prod WHERE id = ?", [id]);
  res.sendStatus(200);
}));

module.exports = router;