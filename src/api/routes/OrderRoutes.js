const express = require("express");
const { validateOrderData } = require("../validators"); // Валидация данных заказа
const { db } = require("../database"); // Подключение базы данных
const asyncMiddleware = require("../middlewares/asyncMiddleware"); // Обработка ошибок для async

const router = express.Router();

// Получение всех заказов с именем предприятия
router.get("/", asyncMiddleware(async (req, res) => {
  const query = `
    SELECT 
      o.id AS order_id, 
      o.name AS order_name, 
      p.name AS predpr_name
    FROM 
      \`order\` o
    JOIN 
      \`predpr\` p ON o.predpr_id = p.id
    ORDER BY o.id;
  `;
  
  const [rows] = await db.query(query);
  res.status(200).json(rows);
}));

// Создание нового заказа
router.post("/", asyncMiddleware(async (req, res) => {
  const { name, predpr_id } = req.body;

  // Валидация данных
  const validationError = validateOrderData(name, predpr_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Добавление заказа
  const [result] = await db.query("INSERT INTO `order` (name, predpr_id) VALUES (?, ?)", [name, predpr_id]);
  res.status(201).json({ id: result.insertId, name, predpr_id });
}));

// Обновление существующего заказа
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, predpr_id } = req.body;

  // Валидация данных
  const validationError = validateOrderData(name, predpr_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования заказа
  const [existingOrder] = await db.query("SELECT * FROM `order` WHERE id = ?", [id]);
  if (existingOrder.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Обновление заказа
  await db.query("UPDATE `order` SET name = ?, predpr_id = ? WHERE id = ?", [name, predpr_id, id]);
  res.status(200).json({ message: "Order updated successfully" });
}));

// Удаление заказа
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  // Проверка существования заказа
  const [existingOrder] = await db.query("SELECT * FROM `order` WHERE id = ?", [id]);
  if (existingOrder.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Удаление заказа
  await db.query("DELETE FROM `order` WHERE id = ?", [id]);
  res.status(200).json({ message: "Order deleted successfully" });
}));

module.exports = router;
