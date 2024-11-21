// Вспомогательные функции
const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== "";
const isValidNumber = (value) => typeof value === "number" && !isNaN(value);
const isValidDate = (value) => !isNaN(new Date(value).getTime());

module.exports = {
  validateCategoryData: (name) => {
    if (!isNonEmptyString(name)) {
      return "Category name is required and must be a non-empty string.";
    }
    return null;
  },

  validateOrderData: (name, predpr_id) => {
    if (!isNonEmptyString(name)) {
      return "Order name is required and must be a non-empty string.";
    }
    if (!isValidNumber(predpr_id)) {
      return "Predpr_id must be a valid number.";
    }
    return null;
  },

  validatePredprData: (name, address) => {
    if (!isNonEmptyString(name)) {
      return "Predpr name is required and must be a non-empty string.";
    }
    if (!isNonEmptyString(address)) {
      return "Address is required and must be a non-empty string.";
    }
    return null;
  },

  validateProdData: (name, price, categ_id) => {
    if (!isNonEmptyString(name)) {
      return "Product name is required and must be a non-empty string.";
    }
    if (!isValidNumber(price) || price <= 0) {
      return "Price must be a valid number greater than 0.";
    }
    if (!isValidNumber(categ_id)) {
      return "Category ID must be a valid number.";
    }
    return null;
  },

  validateSkladData: (prod_id, kol, date_in) => {
    if (!isValidNumber(prod_id)) {
      return "Product ID must be a valid number.";
    }
    if (!isValidNumber(kol) || kol <= 0) {
      return "Quantity must be a valid number greater than 0.";
    }
    if (!isValidDate(date_in)) {
      return "Date in must be a valid date.";
    }
    return null;
  },

  validateSpecData: (order_id, prod_id, kol) => {
    if (!isValidNumber(order_id)) {
      return "Order ID must be a valid number.";
    }
    if (!isValidNumber(prod_id)) {
      return "Product ID must be a valid number.";
    }
    if (!isValidNumber(kol) || kol <= 0) {
      return "Quantity must be a valid number greater than 0.";
    }
    return null;
  }
};
