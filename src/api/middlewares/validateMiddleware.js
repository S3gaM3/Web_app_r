// middlewares/validateMiddleware.js

const { validateCategoryData, validateOrderData, validatePredprData, validateProdData, validateSkladData, validateSpecData } = require("../validators");

const validate = (type) => {
  return (req, res, next) => {
    let validationError;
    switch (type) {
      case "category":
        validationError = validateCategoryData(req.body.name);
        break;
      case "order":
        validationError = validateOrderData(req.body.name, req.body.predpr_id);
        break;
      case "predpr":
        validationError = validatePredprData(req.body.name, req.body.address);
        break;
      case "prod":
        validationError = validateProdData(req.body.name, req.body.price, req.body.categ_id);
        break;
      case "sklad":
        validationError = validateSkladData(req.body.prod_id, req.body.kol, req.body.date_in);
        break;
      case "spec":
        validationError = validateSpecData(req.body.order_id, req.body.prod_id, req.body.kol);
        break;
      default:
        return next();
    }
    
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    next(); // Если нет ошибок, переходим к следующему мидлвару
  };
};

module.exports = validate;
