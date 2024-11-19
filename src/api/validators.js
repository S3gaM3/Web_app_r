// Валидация данных для разных сущностей
module.exports = {
    validateCategoryData: (name) => {
      if (!name || typeof name !== "string" || name.trim() === "") {
        return "Category name is required and must be a non-empty string.";
      }
      return null;
    },
  
    validateOrderData: (name, predpr_id) => {
      if (!name || typeof name !== "string" || name.trim() === "") {
        return "Order name is required and must be a non-empty string.";
      }
      // Преобразуем predpr_id в число и проверяем его корректность
      if (!predpr_id || isNaN(Number(predpr_id))) {
        return "Predpr_id must be a valid number.";
      }
      return null;
    },
    
  
    validatePredprData: (name, address) => {
      if (!name || typeof name !== "string" || name.trim() === "") {
        return "Predpr name is required and must be a non-empty string.";
      }
      if (!address || typeof address !== "string" || address.trim() === "") {
        return "Address is required and must be a non-empty string.";
      }
      return null;
    },
  
    validateProdData: (name, price, categ_id) => {
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
    },
  
    validateSkladData: (prod_id, kol, date_in) => {
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
    },
  
    validateSpecData: (order_id, prod_id, kol) => {
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
  };
  