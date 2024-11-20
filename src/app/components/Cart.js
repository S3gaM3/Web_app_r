import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const Cart = ({ showSnackbar }) => {
  const [products, setProducts] = useState([]); // Продукты из базы данных
  const [cart, setCart] = useState([]); // Продукты в корзине
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Для загрузки истории заказов
  const [orderHistory, setOrderHistory] = useState([]); // История заказов
  const [orderName, setOrderName] = useState(""); // Имя заказа
  const [predprId, setPredprId] = useState(""); // ID выбранного предприятия
  const [enterprises, setEnterprises] = useState([]); // Список предприятий
  const [orderCount, setOrderCount] = useState(0); // Счетчик заказов

  useEffect(() => {
    fetchProducts(); // Загружаем список продуктов
    fetchOrderHistory(); // Загружаем историю заказов
    fetchEnterprises(); // Загружаем список предприятий
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/prod");
      setProducts(response.data);
    } catch (error) {
      showSnackbar("Ошибка при загрузке продуктов.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/order");
      setOrderHistory(response.data);
      setOrderCount(response.data.length); // Обновляем счетчик заказов
    } catch (error) {
      showSnackbar("Ошибка при загрузке истории заказов.", "error");
    } finally {
      setIsLoading(false); // Завершаем индикатор загрузки
    }
  };

  const fetchEnterprises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/predpr");
      setEnterprises(response.data);
    } catch (error) {
      showSnackbar("Ошибка при загрузке предприятий.", "error");
    }
  };

  const addToCart = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newCart = [...cart];
    const existingProduct = newCart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      newCart.push({ ...product, quantity });
    }

    setCart(newCart); // Обновляем корзину
    setSelectedProduct(""); // Очищаем выбранный продукт
    setQuantity(1); // Сбрасываем количество
    showSnackbar("Продукт добавлен в корзину.", "success");
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    showSnackbar("Продукт удален из корзины.", "success");
  };

  const handleQuantityChange = (productId, value) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: value } : item
    );
    setCart(updatedCart);
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const generateOrderName = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`; // Время
    return `Счет № ${orderCount + 1} от ${formattedDate} в ${time}`;
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showSnackbar("Корзина пуста, добавьте товары для заказа.", "error");
      return;
    }

    const generatedOrderName = generateOrderName(); // Генерация имени счета
    setOrderName(generatedOrderName); // Устанавливаем имя заказа

    if (!orderName) {
      showSnackbar("Пожалуйста, введите имя заказа.", "error");
      return;
    }

    if (!predprId) {
      showSnackbar("Выберите предприятие.", "error");
      return;
    }

    const orderData = {
      name: generatedOrderName,
      products: cart,
      total: getTotal(),
      date: new Date(),
      predpr_id: predprId,
    };

    try {
      await axios.post("http://localhost:5000/api/order", orderData);
      showSnackbar("Заказ размещен успешно!", "success");
      setCart([]); // Очищаем корзину после размещения заказа
      setOrderName(""); // Очищаем имя заказа
      setPredprId(""); // Очищаем выбранное предприятие
      fetchOrderHistory(); // Обновляем историю заказов
    } catch (error) {
      showSnackbar("Ошибка при размещении заказа.", "error");
    }
  };

  return (
    <div>
      {/* Добавление продукта в корзину */}
      <FormControl fullWidth>
        <InputLabel>Выберите продукт</InputLabel>
        <Select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name} - {product.price}₽
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Количество */}
      <TextField
        label="Количество"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        inputProps={{ min: 1 }}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={addToCart}>
        Добавить в корзину
      </Button>

      {/* Имя заказа */}
      <TextField
        label="Имя заказа"
        value={orderName}
        onChange={(e) => setOrderName(e.target.value)}
        fullWidth
        margin="normal"
        disabled
      />

      {/* Выбор предприятия */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Выберите предприятие</InputLabel>
        <Select
          value={predprId}
          onChange={(e) => setPredprId(e.target.value)}
        >
          {enterprises.map((enterprise) => (
            <MenuItem key={enterprise.id} value={enterprise.id}>
              {enterprise.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Отображение корзины */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Продукт</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Итого</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}₽</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
                <TableCell>{item.price * item.quantity}₽</TableCell>
                <TableCell>
                  <IconButton onClick={() => removeFromCart(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Общая сумма */}
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Общая сумма: {getTotal()}₽
      </Typography>

      {/* Кнопка заказать */}
      <Button
        variant="contained"
        color="secondary"
        onClick={placeOrder}
        style={{ marginTop: "20px" }}
      >
        Заказать
      </Button>

      {/* История заказов */}
      <Typography variant="h5" style={{ marginTop: "40px" }}>
        История заказов:
      </Typography>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {orderHistory.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_name}</TableCell>
                  <TableCell>{order.predpr_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default Cart;
