const express = require("express");
const { validatePredprData } = require("../validators"); // Валидация данных
const { db } = require("../database"); // Подключение к базе данных
const asyncMiddleware = require("../middlewares/asyncMiddleware"); // Асинхронная обработка ошибок

const router = express.Router();

// Получение всех организаций
router.get("/", asyncMiddleware(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM predpr ORDER BY id");
  res.status(200).json(rows);
}));

// Создание новой организации
router.post("/", asyncMiddleware(async (req, res) => {
  const { name, address } = req.body;

  // Валидация данных
  const validationError = validatePredprData(name, address);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Добавление новой организации
  const [result] = await db.query("INSERT INTO predpr (name, address) VALUES (?, ?)", [name, address]);
  res.status(201).json({ id: result.insertId, name, address });
}));

// Обновление существующей организации
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  // Валидация данных
  const validationError = validatePredprData(name, address);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования организации
  const [existingPredpr] = await db.query("SELECT * FROM predpr WHERE id = ?", [id]);
  if (existingPredpr.length === 0) {
    return res.status(404).json({ error: "Organization not found" });
  }

  // Обновление организации
  await db.query("UPDATE predpr SET name = ?, address = ? WHERE id = ?", [name, address, id]);
  res.status(200).json({ message: "Organization updated successfully" });
}));

// Удаление организации
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  // Проверка существования организации
  const [existingPredpr] = await db.query("SELECT * FROM predpr WHERE id = ?", [id]);
  if (existingPredpr.length === 0) {
    return res.status(404).json({ error: "Organization not found" });
  }

  // Удаление организации
  await db.query("DELETE FROM predpr WHERE id = ?", [id]);
  res.status(200).json({ message: "Organization deleted successfully" });
}));

module.exports = router;
