import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api/prod";

export default function ProdList({ showSnackbar }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", price: "", categ_id: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);  // Для блокировки повторных запросов
  const [isDeleting, setIsDeleting] = useState(false);  // Для блокировки кнопки "Удалить"

  useEffect(() => {
    fetchProducts();
  }, []);

  // Загрузка списка продуктов
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setProducts(response.data);
    } catch (error) {
      showSnackbar("Ошибка при загрузке продукции.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Открытие диалога
  const openDialog = (product = null) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        categ_id: product.categ_id,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  // Закрытие диалога
  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  // Валидация формы
  const validateForm = () => {
    const { name, price, categ_id } = formData;
    if (!name || !price || !categ_id) {
      showSnackbar("Все поля должны быть заполнены.", "error");
      return false;
    }
    if (parseFloat(price) <= 0) {
      showSnackbar("Цена должна быть положительным числом.", "error");
      return false;
    }
    return true;
  };

  // Обработка формы
  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    const { id, name, price, categ_id } = formData;
    const productData = {
      name,
      price: parseFloat(price),
      categ_id: parseInt(categ_id),
    };

    setIsSubmitting(true); // Блокировка кнопки

    try {
      if (id) {
        await axios.put(`${API_BASE_URL}/${id}`, productData);
        showSnackbar("Продукт обновлен.", "success");
      } else {
        await axios.post(API_BASE_URL, productData);
        showSnackbar("Продукт добавлен.", "success");
      }

      closeDialog();
      fetchProducts();
    } catch (error) {
      showSnackbar("Ошибка при добавлении или обновлении продукта.", "error");
    } finally {
      setIsSubmitting(false);  // Снятие блокировки
    }
  };

  // Удаление продукта
  const handleDeleteProduct = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      showSnackbar("Продукт удален.", "success");
      fetchProducts();
    } catch (error) {
      showSnackbar("Ошибка при удалении продукта.", "error");
    } finally {
      setIsDeleting(false); // Снятие блокировки кнопки "Удалить"
    }
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({ id: "", name: "", price: "", categ_id: "" });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => openDialog()} style={{ marginBottom: "20px" }}>
        Добавить продукт
      </Button>

      <TableContainer component={Paper}>
        {isLoading ? (
          <CircularProgress style={{ margin: "20px auto", display: "block" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">ID</Typography></TableCell>
                <TableCell><Typography variant="h6">Название</Typography></TableCell>
                <TableCell><Typography variant="h6">Цена</Typography></TableCell>
                <TableCell><Typography variant="h6">Категория</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Действия</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => openDialog(product)}
                      disabled={isSubmitting || isDeleting}
                    >
                      Обновить
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={isSubmitting || isDeleting}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Диалог для добавления/редактирования продукта */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{formData.id ? "Редактировать продукт" : "Добавить продукт"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Название продукта"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Цена"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Категория ID"
            type="number"
            value={formData.categ_id}
            onChange={(e) => setFormData({ ...formData, categ_id: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Отмена
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            disabled={isSubmitting} // Блокировка кнопки при отправке
          >
            {isSubmitting ? <CircularProgress size={24} /> : formData.id ? "Обновить" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
