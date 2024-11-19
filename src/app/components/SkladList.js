import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";
import { useSnackbar } from "./SnackbarProvider"; // Контекст для уведомлений

const API_BASE_URL = "http://localhost:5000/api/sklad"; // URL для API склада
const PRODUCTS_API_URL = "http://localhost:5000/api/prod"; // URL для получения списка продуктов

const SkladList = () => {
  const [skladData, setSkladData] = useState([]);
  const [products, setProducts] = useState([]); // Для списка продуктов
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSklad, setEditingSklad] = useState(null);
  const [formData, setFormData] = useState({ productId: "", quantity: "", dateIn: "" });
  const { showSnackbar } = useSnackbar();

  // Загружаем данные склада и список продуктов с сервера
  useEffect(() => {
    fetchSkladData();
    fetchProducts();
  }, []);

  const fetchSkladData = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setSkladData(response.data);
    } catch (error) {
      showSnackbar("Ошибка при загрузке данных склада.", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCTS_API_URL);
      setProducts(response.data);
    } catch (error) {
      showSnackbar("Ошибка при загрузке списка продуктов.", "error");
    }
  };

  // Обработка изменений в форме
  const handleInputChange = (field, value) => {
    // Преобразуем строку в число для quantity
    if (field === "quantity") {
      value = value ? Number(value) : ""; // Преобразуем в число или очищаем
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Сохранение данных склада (добавление или редактирование)
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Проверки на обязательные поля
    if (!formData.productId || formData.quantity === "" || !formData.dateIn) {
      showSnackbar("Пожалуйста, заполните все поля.", "error");
      return;
    }

    // Проверка, что количество является действительным числом
    const quantity = formData.quantity;
    if (isNaN(quantity) || quantity <= 0) {
      showSnackbar("Количество должно быть числом больше нуля.", "error");
      return;
    }

    const skladData = {
      prod_id: formData.productId,  // productId теперь указывает на выбранный продукт
      kol: quantity, // Количество должно быть числом
      date_in: formData.dateIn,
    };

    const apiMethod = editingSklad ? axios.put : axios.post;
    const url = editingSklad ? `${API_BASE_URL}/${editingSklad.id}` : API_BASE_URL;

    try {
      await apiMethod(url, skladData);
      showSnackbar(
        editingSklad ? "Данные склада успешно обновлены!" : "Новая запись склада добавлена!",
        "success"
      );
      closeDialog();
      fetchSkladData();
    } catch (error) {
      showSnackbar("Ошибка при сохранении данных склада.", "error");
    }
  };

  // Удаление записи склада
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      showSnackbar("Запись склада успешно удалена!", "success");
      fetchSkladData();
    } catch (error) {
      showSnackbar("Ошибка при удалении записи склада.", "error");
    }
  };

  // Открытие диалога для добавления/редактирования
  const openDialog = (sklad = null) => {
    setEditingSklad(sklad); // Устанавливаем текущую запись для редактирования
    setFormData({
      productId: sklad?.prod_id || "", // Если это новая запись, оставляем пустым
      quantity: sklad?.kol || "", // Если это новая запись, оставляем пустым
      dateIn: sklad?.date_in || "", // Если это новая запись, оставляем пустым
    });
    setDialogOpen(true);
  };

  // Закрытие диалога
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSklad(null);
    setFormData({ productId: "", quantity: "", dateIn: "" });
  };

  return (
    <Box>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="contained" color="primary" onClick={() => openDialog()}>
          Добавить запись в склад
        </Button>
      </Box>

      {/* Таблица данных склада */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Продукт</Typography></TableCell>
              <TableCell><Typography variant="h6">Количество</Typography></TableCell>
              <TableCell><Typography variant="h6">Дата поступления</Typography></TableCell>
              <TableCell align="right"><Typography variant="h6">Действия</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skladData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{new Date(item.date_in).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => openDialog(item)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог для добавления/редактирования данных склада */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {editingSklad ? "Редактировать запись склада" : "Добавить запись в склад"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Продукт"
            fullWidth
            value={formData.productId}
            onChange={(e) => handleInputChange("productId", e.target.value)}
            margin="normal"
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Количество"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Дата поступления"
            type="date"
            fullWidth
            value={formData.dateIn}
            onChange={(e) => handleInputChange("dateIn", e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingSklad ? "Обновить" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkladList;
