const express = require("express");
const { validateSkladData } = require("../validators");  // Импортируем валидатор для данных
const { db } = require("../database");  // Подключение к базе данных
const asyncMiddleware = require("../middlewares/asyncMiddleware");  // Асинхронный middleware

const router = express.Router();

// Получение всех записей склада с наименованиями продуктов
router.get("/", asyncMiddleware(async (req, res) => {
  const query = `
    SELECT 
      sklad.id,
      prod.name AS product_name,
      sklad.kol AS quantity,
      sklad.date_in
    FROM 
      sklad
    JOIN 
      prod ON sklad.prod_id = prod.id
  `;
  const [rows] = await db.query(query);
  res.json(rows);
}));

// Добавление новой записи в склад
router.post("/", asyncMiddleware(async (req, res) => {
  const { prod_id, kol, date_in } = req.body;
  const validationError = validateSkladData(prod_id, kol, date_in);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const [result] = await db.query("INSERT INTO sklad (prod_id, kol, date_in) VALUES (?, ?, ?)", [prod_id, kol, date_in]);
  
  const [product] = await db.query("SELECT name FROM prod WHERE id = ?", [prod_id]);
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
  const validationError = validateSkladData(prod_id, kol, date_in);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await db.query("UPDATE sklad SET prod_id = ?, kol = ?, date_in = ? WHERE id = ?", [prod_id, kol, date_in, id]);

  const [product] = await db.query("SELECT name FROM prod WHERE id = ?", [prod_id]);
  res.json({ 
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

  const [sklad] = await db.query("SELECT prod_id FROM sklad WHERE id = ?", [id]);
  const [product] = await db.query("SELECT name FROM prod WHERE id = ?", [sklad[0].prod_id]);

  await db.query("DELETE FROM sklad WHERE id = ?", [id]);
  res.json({ message: `Product ${product[0].name} removed from sklad.` });
}));

module.exports = router;
