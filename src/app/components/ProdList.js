import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";

export default function ProdList({ showSnackbar }) {
  const [products, setProducts] = useState([]);
  const [prodId, setProdId] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategId, setProdCategId] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/prod");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showSnackbar("Ошибка при загрузке продукции.", "error");
    }
  };

  const handleAddOrUpdateProduct = async () => {
    const productData = {
      name: prodName,
      price: parseFloat(prodPrice),
      categ_id: parseInt(prodCategId),
    };

    try {
      if (prodId) {
        // Update product
        productData.id = parseInt(prodId);
        await axios.put("http://localhost:5000/api/prod", productData);
        showSnackbar("Продукт обновлен.", "success");
      } else {
        // Add new product
        await axios.post("http://localhost:5000/api/prod", productData);
        showSnackbar("Продукт добавлен.", "success");
      }

      // Reset form
      setProdId("");
      setProdName("");
      setProdPrice("");
      setProdCategId("");
      fetchProducts();
    } catch (error) {
      showSnackbar("Ошибка при добавлении или обновлении продукта.", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/prod/${id}`);
      showSnackbar("Продукт удален.", "success");
      fetchProducts();
    } catch (error) {
      showSnackbar("Ошибка при удалении продукта.", "error");
    }
  };

  const moveDataForUpdate = (product) => {
    setProdId(product.id);
    setProdName(product.name);
    setProdPrice(product.price);
    setProdCategId(product.categ_id);
  };

  return (
    <div>
      <Grid2 container spacing={2} justifyContent="center" style={{ marginBottom: "20px" }}>
        <Grid2 item xs={3}>
          <TextField
            label="Название продукта"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid2>
        <Grid2 item xs={3}>
          <TextField
            label="Цена"
            type="number"
            value={prodPrice}
            onChange={(e) => setProdPrice(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid2>
        <Grid2 item xs={3}>
          <TextField
            label="Категория ID"
            type="number"
            value={prodCategId}
            onChange={(e) => setProdCategId(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid2>
        <Grid2 item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrUpdateProduct}
            fullWidth
          >
            {prodId ? "Обновить" : "Добавить"}
          </Button>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Категория ID</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.categ_id}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => moveDataForUpdate(product)}
                  >
                    Обновить
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
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
