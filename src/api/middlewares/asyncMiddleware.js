const asyncMiddleware = (fn) => (req, res, next) => {
  // Выполняем асинхронную функцию и ловим ошибки, передавая их в обработчик ошибок
  Promise.resolve(fn(req, res, next)).catch(next); // Если ошибка возникла, она передается в next()
};

module.exports = asyncMiddleware;
