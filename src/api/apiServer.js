const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе данных с улучшенной обработкой ошибок
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Обработчик ошибок с улучшенной логикой
function handleError(res, err, customMessage) {
  console.error(customMessage, err.message);
  if (res) {
    res.status(500).json({ error: customMessage || "Internal Server Error" });
  }
}

// Подключение к базе данных с улучшенной проверкой
async function connectToDatabase() {
  try {
    await db.getConnection();
    console.log("Connected to the database.");
  } catch (err) {
    handleError(null, err, "Database connection failed:");
    process.exit(1);
  }
}
connectToDatabase();

// Валидация данных для разных сущностей
function validateCategoryData(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Category name is required and must be a non-empty string.";
  }
  return null;
}

function validateOrderData(name, predpr_id) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Order name is required and must be a non-empty string.";
  }
  if (!predpr_id || typeof predpr_id !== "number") {
    return "Predpr_id must be a valid number.";
  }
  return null;
}

function validatePredprData(name, address) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Predpr name is required and must be a non-empty string.";
  }
  if (!address || typeof address !== "string" || address.trim() === "") {
    return "Address is required and must be a non-empty string.";
  }
  return null;
}

function validateProdData(name, price, categ_id) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "Product name is required and must be a non-empty string.";
  }
  if (!price || typeof price !== "number") {
    return "Price must be a valid number.";
  }
  if (!categ_id || typeof categ_id !== "number") {
    return "Category ID must be a valid number.";
  }
  return null;
}

function validateSkladData(prod_id, kol, date_in) {
  if (!prod_id || typeof prod_id !== "number") {
    return "Product ID must be a valid number.";
  }
  if (!kol || typeof kol !== "number") {
    return "Quantity must be a valid number.";
  }
  if (!date_in || isNaN(new Date(date_in))) {
    return "Date in must be a valid date.";
  }
  return null;
}

function validateSpecData(order_id, prod_id, kol) {
  if (!order_id || typeof order_id !== "number") {
    return "Order ID must be a valid number.";
  }
  if (!prod_id || typeof prod_id !== "number") {
    return "Product ID must be a valid number.";
  }
  if (!kol || typeof kol !== "number") {
    return "Quantity must be a valid number.";
  }
  return null;
}
// CRUD для таблицы `categ`
app.get("/api/categ", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categ");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "Error fetching categories:");
  }
});

app.post("/api/categ", async (req, res) => {
  const { name } = req.body;
  const validationError = validateCategoryData(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [result] = await db.query("INSERT INTO categ (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    handleError(res, err, "Error adding category:");
  }
});

app.put("/api/categ/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const validationError = validateCategoryData(name);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await db.query("UPDATE categ SET name = ? WHERE id = ?", [name, id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error updating category:");
  }
});

app.delete("/api/categ/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM categ WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error deleting category:");
  }
});

// CRUD для таблицы `order`
app.get("/api/order", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM `order`");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "Error fetching orders:");
  }
});

app.post("/api/order", async (req, res) => {
  const { name, predpr_id } = req.body;
  const validationError = validateOrderData(name, predpr_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [result] = await db.query("INSERT INTO `order` (name, predpr_id) VALUES (?, ?)", [name, predpr_id]);
    res.status(201).json({ id: result.insertId, name, predpr_id });
  } catch (err) {
    handleError(res, err, "Error adding order:");
  }
});

app.put("/api/order/:id", async (req, res) => {
  const { id } = req.params;
  const { name, predpr_id } = req.body;
  const validationError = validateOrderData(name, predpr_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await db.query("UPDATE `order` SET name = ?, predpr_id = ? WHERE id = ?", [name, predpr_id, id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error updating order:");
  }
});

app.delete("/api/order/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM `order` WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error deleting order:");
  }
});
// CRUD для таблицы `predpr`
app.get("/api/predpr", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM predpr");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "Error fetching predpr:");
  }
});

app.post("/api/predpr", async (req, res) => {
  const { name, address } = req.body;
  const validationError = validatePredprData(name, address);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [result] = await db.query("INSERT INTO predpr (name, address) VALUES (?, ?)", [name, address]);
    res.status(201).json({ id: result.insertId, name, address });
  } catch (err) {
    handleError(res, err, "Error adding predpr:");
  }
});

app.put("/api/predpr/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  const validationError = validatePredprData(name, address);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await db.query("UPDATE predpr SET name = ?, address = ? WHERE id = ?", [name, address, id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error updating predpr:");
  }
});

app.delete("/api/predpr/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM predpr WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error deleting predpr:");
  }
});

// CRUD для таблицы `prod`
app.get("/api/prod", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM prod");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "Error fetching products:");
  }
});

app.post("/api/prod", async (req, res) => {
  const { name, price, categ_id } = req.body;
  const validationError = validateProdData(name, price, categ_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [result] = await db.query("INSERT INTO prod (name, price, categ_id) VALUES (?, ?, ?)", [name, price, categ_id]);
    res.status(201).json({ id: result.insertId, name, price, categ_id });
  } catch (err) {
    handleError(res, err, "Error adding product:");
  }
});

app.put("/api/prod/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, categ_id } = req.body;
  const validationError = validateProdData(name, price, categ_id);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await db.query("UPDATE prod SET name = ?, price = ?, categ_id = ? WHERE id = ?", [name, price, categ_id, id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error updating product:");
  }
});

app.delete("/api/prod/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM prod WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error deleting product:");
  }
});
// CRUD для таблицы `sklad`
app.get("/api/sklad", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sklad");
    res.json(rows);
  } catch (err) {
    handleError(res, err, "Error fetching sklad:");
  }
});

app.post("/api/sklad", async (req, res) => {
  const { prod_id, kol, date_in } = req.body;
  const validationError = validateSkladData(prod_id, kol, date_in);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [result] = await db.query("INSERT INTO sklad (prod_id, kol, date_in) VALUES (?, ?, ?)", [prod_id, kol, date_in]);
    res.status(201).json({ id: result.insertId, prod_id, kol, date_in });
  } catch (err) {
    handleError(res, err, "Error adding sklad:");
  }
});

app.put("/api/sklad/:id", async (req, res) => {
  const { id } = req.params;
  const { prod_id, kol, date_in } = req.body;
  const validationError = validateSkladData(prod_id, kol, date_in);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await db.query("UPDATE sklad SET prod_id = ?, kol = ?, date_in = ? WHERE id = ?", [prod_id, kol, date_in, id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error updating sklad:");
  }
});

app.delete("/api/sklad/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM sklad WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error deleting sklad:");
  }
});

// CRUD для таблицы `spec`
app.get("/api/spec", async (req, res) => {
  try {
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
  } catch (err) {
    handleError(res, err, "Error fetching spec:");
  }
});

app.post("/api/spec", async (req, res) => {
  const { order_id, prod_id, kol } = req.body;
  const validationError = validateSpecData(order_id, prod_id, kol);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const [result] = await db.query("INSERT INTO spec (order_id, prod_id, kol) VALUES (?, ?, ?)", [order_id, prod_id, kol]);
    res.status(201).json({ id: result.insertId, order_id, prod_id, kol });
  } catch (err) {
    handleError(res, err, "Error adding spec:");
  }
});

app.put("/api/spec/:id", async (req, res) => {
  const { id } = req.params;
  const { order_id, prod_id, kol } = req.body;
  const validationError = validateSpecData(order_id, prod_id, kol);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await db.query("UPDATE spec SET order_id = ?, prod_id = ?, kol = ? WHERE id = ?", [order_id, prod_id, kol, id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error updating spec:");
  }
});

app.delete("/api/spec/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM spec WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    handleError(res, err, "Error deleting spec:");
  }
});
// Запуск сервера на порту 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
