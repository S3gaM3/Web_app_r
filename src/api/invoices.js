app.post('/api/invoices', async (req, res) => {
    try {
      const { products, date, total } = req.body;
      const invoice = new Invoice({
        products,
        date,
        total,
      });
      await invoice.save();
      res.status(201).json({ message: "Счет успешно создан", invoice });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка при создании счета" });
    }
  });