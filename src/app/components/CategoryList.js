import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Grid2, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useSnackbar } from "./SnackbarProvider"; // Предполагается, что SnackbarProvider есть

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); // Для редактирования категории
  const [categoryName, setCategoryName] = useState(""); // Для ввода имени категории
  const { showSnackbar } = useSnackbar(); // Для отображения уведомлений

  // Загрузка категорий с сервера
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categ");
      setCategories(response.data);
    } catch (error) {
      showSnackbar("Не удалось загрузить категории.", "error");
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await axios.post("/api/categ", { name: newCategory });
        setNewCategory("");
        fetchCategories();
        showSnackbar("Категория добавлена.", "success");
      } catch (error) {
        showSnackbar("Ошибка при добавлении категории.", "error");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categ/${id}`);
      fetchCategories(); 
      showSnackbar("Категория удалена.", "success");
    } catch (error) {
      showSnackbar("Ошибка при удалении категории.", "error");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (categoryName.trim()) {
      try {
        await axios.put(`http://localhost:5000/api/categ/${editingCategory.id}`, { name: categoryName });
        setEditingCategory(null);
        setCategoryName("");
        fetchCategories();
        showSnackbar("Категория обновлена.", "success");
      } catch (error) {
        showSnackbar("Ошибка при обновлении категории.", "error");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryName("");
  };

  return (
    <div>
      <Grid2 container spacing={2} justifyContent="center" alignItems="center" style={{ marginBottom: "20px" }}>
        {/* Ввод новой категории */}
        <Grid2 item xs={12} sm={8} md={4}>
          <TextField
            label="Новая категория"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
        </Grid2>
        {/* Кнопка добавления категории */}
        <Grid2 item xs={12} sm={4} md={2}>
          <Button variant="contained" color="primary" onClick={handleAddCategory} fullWidth>
            Добавить категорию
          </Button>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Категория</Typography></TableCell>
              <TableCell align="right"><Typography variant="h6">Действия</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="primary" onClick={() => handleEditCategory(category)}>
                    Редактировать
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteCategory(category.id)}>
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалоговое окно для редактирования категории */}
      {editingCategory && (
        <Dialog open={Boolean(editingCategory)} onClose={handleCancelEdit}>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogContent>
            <TextField
              label="Имя категории"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              variant="outlined"
              style={{ marginBottom: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit} color="primary">
              Отмена
            </Button>
            <Button onClick={handleUpdateCategory} color="primary">
              Обновить
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
