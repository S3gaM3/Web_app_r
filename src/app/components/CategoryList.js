import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  Grid2,
  Button,
  Typography,
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
} from "@mui/material";
import { useSnackbar } from "./SnackbarProvider";

const API_BASE_URL = "http://localhost:5000/api/categ";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  // Загрузка категорий
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setCategories(response.data);
    } catch (error) {
      showSnackbar(error?.response?.data?.message || "Не удалось загрузить категории.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Добавление новой категории
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      showSnackbar("Введите название категории.", "warning");
      return;
    }

    try {
      await axios.post(API_BASE_URL, { name: newCategory });
      setNewCategory("");
      fetchCategories();
      showSnackbar("Категория успешно добавлена.", "success");
    } catch (error) {
      showSnackbar(error?.response?.data?.message || "Ошибка при добавлении категории.", "error");
    }
  };

  // Удаление категории
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchCategories();
      showSnackbar("Категория успешно удалена.", "success");
    } catch (error) {
      showSnackbar(error?.response?.data?.message || "Ошибка при удалении категории.", "error");
    }
  };

  // Обновление категории
  const handleUpdateCategory = async () => {
    if (!categoryName.trim()) {
      showSnackbar("Введите название категории.", "warning");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/${editingCategory.id}`, { name: categoryName });
      setEditingCategory(null);
      setCategoryName("");
      fetchCategories();
      showSnackbar("Категория успешно обновлена.", "success");
    } catch (error) {
      showSnackbar(error?.response?.data?.message || "Ошибка при обновлении категории.", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCategoryName("");
  };

  return (
    <div>
      {/* Форма добавления категории */}
      <Grid2 container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Grid2 item xs={12} sm={8} md={4}>
          <TextField
            label="Новая категория"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid2>
        <Grid2 item xs={12} sm={4} md={2}>
          <Button variant="contained" color="primary" onClick={handleAddCategory} fullWidth>
            Добавить категорию
          </Button>
        </Grid2>
      </Grid2>

      {/* Таблица с категориями */}
      <TableContainer component={Paper}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress />
          </div>
        ) : categories.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Категория</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Действия</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryName(category.name);
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography sx={{ textAlign: "center", padding: "20px" }}>
            Нет доступных категорий.
          </Typography>
        )}
      </TableContainer>

      {/* Диалог редактирования категории */}
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
              sx={{ mb: 2 }}
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
