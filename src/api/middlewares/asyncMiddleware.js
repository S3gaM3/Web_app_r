// middlewares/asyncMiddleware.js

const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Пытаемся выполнить функцию и если ошибка, передаем ее в обработчик ошибок
  };
  
  module.exports = asyncMiddleware;
  