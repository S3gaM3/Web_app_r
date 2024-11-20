// predprRouter.js
const express = require("express");
const { validatePredprData } = require("../validators");  // Импортируем валидатор для данных
const { db } = require("../database");  // Подключение к базе данных
const asyncMiddleware = require("../middlewares/asyncMiddleware");  // Асинхронный middleware

const router = express.Router();

// Получение всех организаций
router.get("/", asyncMiddleware(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM predpr");
  res.json(rows);
}));

// Создание новой организации
router.post("/", asyncMiddleware(async (req, res) => {
  const { name, address } = req.body;
  const validationError = validatePredprData(name, address);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const [result] = await db.query("INSERT INTO predpr (name, address) VALUES (?, ?)", [name, address]);
  res.status(201).json({ id: result.insertId, name, address });
}));

// Обновление существующей организации
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  const validationError = validatePredprData(name, address);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await db.query("UPDATE predpr SET name = ?, address = ? WHERE id = ?", [name, address, id]);
  res.sendStatus(200);
}));

// Удаление организации
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM predpr WHERE id = ?", [id]);
  res.sendStatus(200);
}));

module.exports = router;
