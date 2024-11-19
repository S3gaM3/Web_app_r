// orderRouter.js
const express = require("express");
const { validateOrderData } = require("../validators");  // Импортируем валидатор для данных
const { db } = require("../database");  // Подключение к базе данных
const asyncMiddleware = require("../middlewares/asyncMiddleware");  // Асинхронный middleware

const router = express.Router();

// Получение всех заказов с именем предприятия вместо predpr_id
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
  `;
  
  const [rows] = await db.query(query);
  res.json(rows);
}));


// Создание нового заказа
router.post("/", asyncMiddleware(async (req, res) => {
  const { name, predpr_id } = req.body;
  const validationError = validateOrderData(name, predpr_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const [result] = await db.query("INSERT INTO `order` (name, predpr_id) VALUES (?, ?)", [name, predpr_id]);
  res.status(201).json({ id: result.insertId, name, predpr_id });
}));

// Обновление существующего заказа
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name, predpr_id } = req.body;
  const validationError = validateOrderData(name, predpr_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await db.query("UPDATE `order` SET name = ?, predpr_id = ? WHERE id = ?", [name, predpr_id, id]);
  res.sendStatus(200);
}));

// Удаление заказа
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM `order` WHERE id = ?", [id]);
  res.sendStatus(200);
}));

module.exports = router;
