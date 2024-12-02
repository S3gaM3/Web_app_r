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

const API_BASE_URL = "http://localhost:5000/api/order";

export default function OrderList({ showSnackbar }) {
  const [orders, setOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ name: "", predpr_id: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editableOrder, setEditableOrder] = useState({ id: null, name: "", predpr_id: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  // Загрузка заказов
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      setOrders(response.data);
    } catch (error) {
      showSnackbar("Не удалось загрузить заказы. Попробуйте позже.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Открытие диалога редактирования
  const openEditDialog = (order) => {
    setEditableOrder(order);
    setEditDialogOpen(true);
  };

  // Закрытие диалога редактирования
  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditableOrder({ id: null, name: "", predpr_id: "" });
  };

  // Валидация данных при редактировании заказа
  const validateEditableOrderData = () => {
    if (!editableOrder.name.trim() || !editableOrder.predpr_id.trim()) {
      showSnackbar("Пожалуйста, заполните все поля.", "warning");
      return false;
    }
    return true;
  };

  // Сохранение изменений заказа
  const handleEditOrder = async () => {
    if (!validateEditableOrderData()) return;

    try {
      await axios.put('${API_BASE_URL}/${editableOrder.id}', {
        name: editableOrder.name,
        predpr_id: editableOrder.predpr_id,
      });
      showSnackbar("Заказ успешно обновлен.", "success");
      closeEditDialog();
      fetchOrders();
    } catch (error) {
      showSnackbar("Ошибка при обновлении заказа.", "error");
    }
  };

  // Открытие диалога для добавления заказа
  const openAddDialog = () => {
    setNewOrder({ name: "", predpr_id: "" });
    setDialogOpen(true);
  };

  // Закрытие диалога добавления
  const closeAddDialog = () => {
    setDialogOpen(false);
    setNewOrder({ name: "", predpr_id: "" });
  };

  // Валидация данных при добавлении нового заказа
  const validateOrderData = () => {
    if (!newOrder.name.trim() || !newOrder.predpr_id.trim()) {
      showSnackbar("Пожалуйста, заполните все поля.", "warning");
      return false;
    }
    return true;
  };

  // Добавление заказа
  const handleAddOrder = async () => {
    if (!validateOrderData()) return;

    try {
      await axios.post(API_BASE_URL, newOrder);
      showSnackbar("Заказ успешно добавлен.", "success");
      closeAddDialog();
      fetchOrders();
    } catch (error) {
      showSnackbar("Ошибка при добавлении заказа.", "error");
    }
  };

  // Открытие диалога подтверждения удаления
  const openDeleteDialog = (id) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };

  // Закрытие диалога удаления
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Удаление заказа
  const handleDeleteOrder = async () => {
    try {
      await axios.delete('${API_BASE_URL}/${selectedOrderId}');
      showSnackbar("Заказ удален.", "success");
      closeDeleteDialog();
      fetchOrders();
    } catch (error) {
      showSnackbar("Ошибка при удалении заказа.", "error");
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
        Добавить заказ
      </Button>

      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        {isLoading ? (
          <CircularProgress style={{ margin: "20px auto", display: "block" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Название заказа</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Предприятие</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Действия</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_name}</TableCell>
                  <TableCell>{order.predpr_name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openDeleteDialog(order.order_id)}
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

      {/* Диалог для добавления заказа */}
      <Dialog open={dialogOpen} onClose={closeAddDialog}>
        <DialogTitle>Добавить заказ</DialogTitle>
        <DialogContent>
          <TextField
            label="Название заказа"
            value={newOrder.name}
            onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID предприятия"
            value={newOrder.predpr_id}
            onChange={(e) =>
              setNewOrder({ ...newOrder, predpr_id: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleAddOrder} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Удалить заказ</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этот заказ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleDeleteOrder} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      {/* Диалог редактирования */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Редактировать заказ</DialogTitle>
        <DialogContent>
          <TextField
            label="Название заказа"
            value={editableOrder.name}
            onChange={(e) =>
              setEditableOrder({ ...editableOrder, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="ID предприятия"
            value={editableOrder.predpr_id}
            onChange={(e) =>
              setEditableOrder({ ...editableOrder, predpr_id: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleEditOrder} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
