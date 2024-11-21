const errorHandler = (err, req, res, next) => {
  console.error(err); // Логируем ошибку, для отслеживания проблем на сервере

  const statusCode = err.statusCode || 500; // Статус ответа (по умолчанию 500, если нет в ошибке)
  
  res.status(statusCode).json({
    message: err.message || "Something went wrong!", // Сообщение об ошибке
    stack: process.env.NODE_ENV === "development" ? err.stack : null, // Показываем стек только в dev-среде
  });
};

module.exports = errorHandler;
