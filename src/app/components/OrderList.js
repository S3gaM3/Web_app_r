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
} from "@mui/material";

export default function OrderList({ showSnackbar }) {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ name: "", predpr_id: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  // Функция для загрузки заказов
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order");
      setOrders(response.data);
    } catch (error) {
      showSnackbar("Не удалось загрузить заказы. Попробуйте позже.", "error");
    }
  };

  // Валидация данных перед добавлением нового заказа
  const validateOrderData = () => {
    if (!newOrder.name || !newOrder.predpr_id) {
      showSnackbar("Пожалуйста, заполните все поля.", "warning");
      return false;
    }
    return true;
  };

  // Добавление нового заказа
  const handleAddOrder = async () => {
    if (!validateOrderData()) return;

    try {
      await axios.post("http://localhost:5000/api/order", newOrder);
      setNewOrder({ name: "", predpr_id: "" });
      fetchOrders(); // Обновить список заказов
      showSnackbar("Заказ успешно добавлен.", "success");
    } catch (error) {
      showSnackbar("Ошибка при добавлении заказа.", "error");
    }
  };

  // Удаление заказа
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/order/${id}`);
      fetchOrders(); // Обновить список после удаления
      showSnackbar("Заказ удален.", "success");
    } catch (error) {
      showSnackbar("Ошибка при удалении заказа.", "error");
    }
  };

  // Отображение списка заказов
  return (
    <div>
      {/* Форма для добавления нового заказа */}
      <Grid2 container spacing={2} justifyContent="center" alignItems="center" style={{ marginBottom: "20px" }}>
        {/* Название заказа */}
        <Grid2 item xs={12} md={5}>
          <TextField
            label="Название заказа"
            value={newOrder.name}
            onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
        </Grid2>

        {/* ID предприятия */}
        <Grid2 item xs={12} md={5}>
          <TextField
            label="ID предприятия"
            value={newOrder.predpr_id}
            onChange={(e) => setNewOrder({ ...newOrder, predpr_id: e.target.value })}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
        </Grid2>

        {/* Кнопка добавления заказа */}
        <Grid2 item xs={12} md={2}>
          <Button variant="contained" color="primary" onClick={handleAddOrder} fullWidth>
            Добавить заказ
          </Button>
        </Grid2>
      </Grid2>

      {/* Таблица с заказами */}
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Название заказа</Typography></TableCell>
              <TableCell><Typography variant="h6">ID предприятия</Typography></TableCell>
              <TableCell align="right"><Typography variant="h6">Действия</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.predpr_id}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteOrder(order.id)}>
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
