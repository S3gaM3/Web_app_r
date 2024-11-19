const express = require("express");
const { validateCategoryData } = require("../validators");
const { db } = require("../database");
const asyncMiddleware = require("../middlewares/asyncMiddleware");

const router = express.Router();

router.get("/", asyncMiddleware(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categ");
  res.json(rows);
}));

router.post("/", asyncMiddleware(async (req, res) => {
  const { name } = req.body;
  const validationError = validateCategoryData(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const [result] = await db.query("INSERT INTO categ (name) VALUES (?)", [name]);
  res.status(201).json({ id: result.insertId, name });
}));

router.put("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const validationError = validateCategoryData(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  await db.query("UPDATE categ SET name = ? WHERE id = ?", [name, id]);
  res.sendStatus(200);
}));

router.delete("/:id", asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM categ WHERE id = ?", [id]);
  res.sendStatus(200);
}));

module.exports = router;
