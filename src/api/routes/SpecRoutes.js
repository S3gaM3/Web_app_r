const express = require("express");
const { validateSpecData } = require("../validators"); // Импорт валидации данных
const { db } = require("../database"); // Подключение базы данных
const asyncMiddleware = require("../middlewares/asyncMiddleware"); // Асинхронная обработка ошибок

const router = express.Router();

// Получение всех записей спецификации с дополнительной информацией
router.get("/", asyncMiddleware(async (req, res) => {
  const query = `
    SELECT 
      spec.id AS spec_id,
      \`order\`.name AS order_name,
      prod.name AS product_name,
      spec.kol AS quantity
    FROM 
      spec
    JOIN 
      \`order\` ON spec.order_id = \`order\`.id
    JOIN 
      prod ON spec.prod_id = prod.id
    ORDER BY spec.id;
  `;
  const [rows] = await db.query(query);
  res.status(200).json(rows);
}));

// Добавление новой записи в спецификацию
router.post("/", asyncMiddleware(async (req, res) => {
  const { order_id, prod_id, kol } = req.body;

  // Валидация данных
  const validationError = validateSpecData(order_id, prod_id, kol);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования заказа и продукта
  const [order] = await db.query("SELECT id FROM `order` WHERE id = ?", [order_id]);
  if (order.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  const [product] = await db.query("SELECT id FROM prod WHERE id = ?", [prod_id]);
  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Добавление записи
  const [result] = await db.query("INSERT INTO spec (order_id, prod_id, kol) VALUES (?, ?, ?)", [order_id, prod_id, kol]);
  res.status(201).json({ id: result.insertId, order_id, prod_id, kol });
}));

// Обновление записи в спецификации
router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { order_id, prod_id, kol } = req.body;

  // Валидация данных
  const validationError = validateSpecData(order_id, prod_id, kol);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Проверка существования записи в спецификации
  const [existingSpec] = await db.query("SELECT * FROM spec WHERE id = ?", [id]);
  if (existingSpec.length === 0) {
    return res.status(404).json({ error: "Spec record not found" });
  }

  // Проверка существования заказа и продукта
  const [order] = await db.query("SELECT id FROM `order` WHERE id = ?", [order_id]);
  if (order.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  const [product] = await db.query("SELECT id FROM prod WHERE id = ?", [prod_id]);
  if (product.length === 0) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Обновление записи
  await db.query("UPDATE spec SET order_id = ?, prod_id = ?, kol = ? WHERE id = ?", [order_id, prod_id, kol, id]);
  res.status(200).json({ id, order_id, prod_id, kol });
}));

// Удаление записи из спецификации
router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  // Проверка существования записи в спецификации
  const [existingSpec] = await db.query("SELECT * FROM spec WHERE id = ?", [id]);
  if (existingSpec.length === 0) {
    return res.status(404).json({ error: "Spec record not found" });
  }

  // Удаление записи
  await db.query("DELETE FROM spec WHERE id = ?", [id]);
  res.status(200).json({ message: `Spec record with ID ${id} has been deleted` });
}));

module.exports = router;
