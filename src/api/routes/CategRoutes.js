const express = require("express");
const { validateCategoryData } = require("../validators");
const { db } = require("../database");
const asyncMiddleware = require("../middlewares/asyncMiddleware");

const router = express.Router();

// Получить все категории
router.get("/", asyncMiddleware(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categ");
  res.status(200).json(rows);
}));

// Создать категорию
router.post("/", asyncMiddleware(async (req, res) => {
  const { name } = req.body;

  // Валидация данных
  const validationError = validateCategoryData(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Добавление категории
  const [result] = await db.query("INSERT INTO categ (name) VALUES (?)", [name]);
  res.status(201).json({ id: result.insertId, name });
}));

// Обновить категорию
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Валидация данных
  const validationError = validateCategoryData(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования категории
  const [existingCategory] = await db.query("SELECT * FROM categ WHERE id = ?", [id]);
  if (existingCategory.length === 0) {
    return res.status(404).json({ error: "Category not found" });
  }

  // Обновление категории
  await db.query("UPDATE categ SET name = ? WHERE id = ?", [name, id]);
  res.status(200).json({ message: "Category updated successfully" });
}));

// Удалить категорию
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  // Проверка существования категории
  const [existingCategory] = await db.query("SELECT * FROM categ WHERE id = ?", [id]);
  if (existingCategory.length === 0) {
    return res.status(404).json({ error: "Category not found" });
  }

  // Удаление категории
  await db.query("DELETE FROM categ WHERE id = ?", [id]);
  res.status(200).json({ message: "Category deleted successfully" });
}));

module.exports = router;
