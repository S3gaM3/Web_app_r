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
} from "@mui/material";
import { useSnackbar } from "./SnackbarProvider";

const API_BASE_URL = "http://localhost:5000/api/spec";

const SpecList = () => {
  const [specs, setSpecs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [formData, setFormData] = useState({ orderName: "", productName: "", quantity: "" });
  const { showSnackbar } = useSnackbar();

  // Загрузка спецификаций с сервера
  useEffect(() => {
    fetchSpecs();
  }, []);

  const fetchSpecs = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setSpecs(response.data);
    } catch (error) {
      showSnackbar("Ошибка при загрузке данных спецификаций.", "error");
    }
  };

  // Обработка изменений в форме
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Сохранение спецификации
  const handleSubmit = async (event) => {
    event.preventDefault();
    const specData = {
      order_name: formData.orderName,
      product_name: formData.productName,
      quantity: formData.quantity,
    };
    const apiMethod = editingSpec ? axios.put : axios.post;
    const url = editingSpec ? `${API_BASE_URL}/${editingSpec.spec_id}` : API_BASE_URL;

    try {
      await apiMethod(url, specData);
      showSnackbar(
        editingSpec ? "Спецификация успешно обновлена!" : "Спецификация успешно добавлена!",
        "success"
      );
      closeDialog();
      fetchSpecs();
    } catch (error) {
      showSnackbar("Ошибка при сохранении спецификации.", "error");
    }
  };

  // Удаление спецификации
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      showSnackbar("Спецификация успешно удалена!", "success");
      fetchSpecs();
    } catch (error) {
      showSnackbar("Ошибка при удалении спецификации.", "error");
    }
  };

  // Открытие диалога
  const openDialog = (spec = null) => {
    setEditingSpec(spec);
    setFormData({
      orderName: spec?.order_name || "",
      productName: spec?.product_name || "",
      quantity: spec?.quantity || "",
    });
    setDialogOpen(true);
  };

  // Закрытие диалога
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSpec(null);
    setFormData({ orderName: "", productName: "", quantity: "" });
  };

  return (
    <Box>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="contained" color="primary" onClick={() => openDialog()}>
          Добавить спецификацию
        </Button>
      </Box>

      {/* Таблица спецификаций */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Название заказа</Typography></TableCell>
              <TableCell><Typography variant="h6">Название продукта</Typography></TableCell>
              <TableCell><Typography variant="h6">Количество</Typography></TableCell>
              <TableCell align="right"><Typography variant="h6">Действия</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specs.map((spec) => (
              <TableRow key={spec.spec_id}>
                <TableCell>{spec.order_name}</TableCell>
                <TableCell>{spec.product_name}</TableCell>
                <TableCell>{spec.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => openDialog(spec)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(spec.spec_id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог для добавления/редактирования */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {editingSpec ? "Редактировать спецификацию" : "Добавить спецификацию"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Название заказа"
            fullWidth
            value={formData.orderName}
            onChange={(e) => handleInputChange("orderName", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Название продукта"
            fullWidth
            value={formData.productName}
            onChange={(e) => handleInputChange("productName", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Количество"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingSpec ? "Обновить" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecList;
