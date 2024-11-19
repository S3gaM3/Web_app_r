// specRouter.js
const express = require("express");
const { validateSpecData } = require("../validators");  // Импортируем валидатор для данных
const { db } = require("../database");  // Подключение к базе данных
const asyncMiddleware = require("../middlewares/asyncMiddleware");  // Асинхронный middleware

const router = express.Router();

// Получение всех записей в spec с дополнительной информацией из других таблиц
router.get("/", asyncMiddleware(async (req, res) => {
  const query = `
    SELECT 
      spec.id AS spec_id,
      (SELECT \`order\`.\`name\` FROM \`order\` WHERE \`order\`.\`id\` = spec.order_id) AS order_name,
      (SELECT prod.name FROM prod WHERE prod.id = spec.prod_id) AS product_name,
      spec.kol AS quantity
    FROM 
      spec
  `;
  const [rows] = await db.query(query);
  res.json(rows);
}));

// Добавление новой записи в spec
router.post("/", asyncMiddleware(async (req, res) => {
  const { order_id, prod_id, kol } = req.body;
  const validationError = validateSpecData(order_id, prod_id, kol);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const [result] = await db.query("INSERT INTO spec (order_id, prod_id, kol) VALUES (?, ?, ?)", [order_id, prod_id, kol]);
  res.status(201).json({ id: result.insertId, order_id, prod_id, kol });
}));

// Обновление записи в spec
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { order_id, prod_id, kol } = req.body;
  const validationError = validateSpecData(order_id, prod_id, kol);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await db.query("UPDATE spec SET order_id = ?, prod_id = ?, kol = ? WHERE id = ?", [order_id, prod_id, kol, id]);
  res.sendStatus(200);
}));

// Удаление записи из spec
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM spec WHERE id = ?", [id]);
  res.sendStatus(200);
}));

module.exports = router;
