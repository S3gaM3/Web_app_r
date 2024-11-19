// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err); // Логирование ошибки
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : null, // Показывать стек ошибки только в dev среде
  });
};

module.exports = errorHandler;
