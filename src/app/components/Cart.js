import React, { useEffect, useState } from "react";
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
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    // Загружаем данные из Local Storage при первой загрузке
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState(() => {
    // Загружаем историю заказов из Local Storage
    const savedHistory = localStorage.getItem("orderHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [orderName, setOrderName] = useState("");
  const [predprId, setPredprId] = useState("");
  const [enterprises, setEnterprises] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchEnterprises();
  }, []);

  useEffect(() => {
    // Сохраняем корзину в Local Storage при её обновлении
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Сохраняем историю заказов в Local Storage при её обновлении
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  }, [orderHistory]);

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

    setCart(newCart);
    setSelectedProduct("");
    setQuantity(1);
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
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return `Счет № ${orderCount + 1} от ${formattedDate} в ${time}`;
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showSnackbar("Корзина пуста, добавьте товары для заказа.", "error");
      return;
    }

    const generatedOrderName = generateOrderName();

    if (!predprId) {
      showSnackbar("Выберите предприятие.", "error");
      return;
    }

    const newOrder = {
      order_name: generatedOrderName,
      predpr_name: enterprises.find((e) => e.id === predprId)?.name || "Не указано",
      products: cart,
      total: getTotal(),
    };

    setOrderHistory([...orderHistory, newOrder]); // Добавляем заказ в историю
    setCart([]); // Очищаем корзину
    setOrderName("");
    setPredprId("");
    setOrderCount(orderCount + 1); // Увеличиваем счетчик заказов
    showSnackbar("Заказ размещен успешно!", "success");
  };

  const removeOrder = (orderName) => {
    // Фильтруем историю заказов, удаляя заказ с указанным name
    const updatedHistory = orderHistory.filter(order => order.order_name !== orderName);
    setOrderHistory(updatedHistory); // Обновляем состояние
    localStorage.setItem("orderHistory", JSON.stringify(updatedHistory)); // Обновляем localStorage
    showSnackbar("Заказ удален из истории.", "success");
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

      {/* Корзина */}
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

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Общая сумма: {getTotal()}₽
      </Typography>

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
              <TableCell>Название заказа</TableCell>
              <TableCell>Предприятие</TableCell>
              <TableCell>Продукты</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderHistory.map((order) => (
              <TableRow key={order.order_name}>
                <TableCell>{order.order_name}</TableCell>
                <TableCell>{order.predpr_name}</TableCell>
                <TableCell>
                  {order.products?.length > 0 ? (
                    <ul>
                      {order.products.map((product, idx) => (
                        <li key={idx}>
                          {product.name} - {product.quantity} шт. ({product.price}₽)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Продукты отсутствуют"
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => removeOrder(order.order_name)}>
                    <Delete />
                  </IconButton>
                </TableCell>
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
