import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api/predpr";

export default function PredprList({ showSnackbar }) {
  const [predpr, setPredpr] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newPredprName, setNewPredprName] = useState(""); // название предприятия
  const [newPredprAddress, setNewPredprAddress] = useState(""); // адрес предприятия
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPredprId, setSelectedPredprId] = useState(null);

  useEffect(() => {
    fetchPredpr();
  }, []);

  // Загрузка списка предприятий
  const fetchPredpr = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setPredpr(response.data);
    } catch (error) {
      showSnackbar("Не удалось загрузить предприятия.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Открытие диалога для добавления предприятия
  const openAddDialog = () => {
    setNewPredprName("");
    setNewPredprAddress("");
    setDialogOpen(true);
  };

  // Закрытие диалога
  const closeAddDialog = () => {
    setDialogOpen(false);
    setNewPredprName("");
    setNewPredprAddress("");
  };

  // Валидация данных нового предприятия
  const validatePredprData = () => {
    if (!newPredprName.trim() || !newPredprAddress.trim()) {
      showSnackbar("Заполните все поля.", "warning");
      return false;
    }
    return true;
  };

  // Обработка добавления предприятия
  const handleAddPredpr = async () => {
    // Валидация данных
    if (!validatePredprData()) {
      return;
    }

    try {
      await axios.post(API_BASE_URL, { name: newPredprName, address: newPredprAddress });
      showSnackbar("Предприятие добавлено.", "success");
      closeAddDialog();
      fetchPredpr(); // Обновляем список предприятий
    } catch (error) {
      showSnackbar("Ошибка при добавлении предприятия.", "error");
    }
  };

  // Открытие диалога подтверждения удаления
  const openDeleteDialog = (id) => {
    setSelectedPredprId(id);
    setDeleteDialogOpen(true);
  };

  // Закрытие диалога подтверждения удаления
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPredprId(null);
  };

  // Обработка удаления предприятия
  const handleDeletePredpr = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${selectedPredprId}`);
      showSnackbar("Предприятие удалено.", "success");
      closeDeleteDialog();
      fetchPredpr(); // Обновляем список предприятий
    } catch (error) {
      showSnackbar("Ошибка при удалении предприятия.", "error");
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={openAddDialog}
        style={{ marginBottom: "20px" }}
      >
        Добавить предприятие
      </Button>

      <TableContainer component={Paper}>
        {isLoading ? (
          <CircularProgress style={{ margin: "20px auto", display: "block" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Предприятие</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Адрес</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Действия</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predpr.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openDeleteDialog(item.id)}
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

      {/* Диалог для добавления предприятия */}
      <Dialog open={dialogOpen} onClose={closeAddDialog}>
        <DialogTitle>Добавить предприятие</DialogTitle>
        <DialogContent>
          <TextField
            label="Название предприятия"
            value={newPredprName}
            onChange={(e) => setNewPredprName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Адрес"
            value={newPredprAddress}
            onChange={(e) => setNewPredprAddress(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleAddPredpr} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Удалить предприятие</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить это предприятие?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleDeletePredpr} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
