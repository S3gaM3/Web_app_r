import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Grid2, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";

export default function PredprList({ showSnackbar }) {
  const [predpr, setPredpr] = useState([]);
  const [newPredpr, setNewPredpr] = useState("");

  useEffect(() => {
    fetchPredpr();
  }, []);

  const fetchPredpr = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/predpr");
      setPredpr(response.data);
    } catch (error) {
      showSnackbar("Не удалось загрузить предприятия.", "error");
    }
  };

  const handleAddPredpr = async () => {
    if (newPredpr) {
      try {
        await axios.post("http://localhost:5000/api/predpr", { name: newPredpr });
        setNewPredpr("");
        fetchPredpr(); // Обновить список предприятий
        showSnackbar("Предприятие добавлено.", "success");
      } catch (error) {
        showSnackbar("Ошибка при добавлении предприятия.", "error");
      }
    } else {
      showSnackbar("Пожалуйста, введите название предприятия.", "warning");
    }
  };

  const handleDeletePredpr = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/predpr/${id}`);
      fetchPredpr(); // Обновить список после удаления
      showSnackbar("Предприятие удалено.", "success");
    } catch (error) {
      showSnackbar("Ошибка при удалении предприятия.", "error");
    }
  };

  return (
    <div>
      <Grid2 container spacing={2} justifyContent="center" alignItems="center" style={{ marginBottom: "20px" }}>
        {/* Ввод нового предприятия */}
        <Grid2 item xs={12} sm={8} md={4}>
          <TextField
            label="Новое предприятие"
            value={newPredpr}
            onChange={(e) => setNewPredpr(e.target.value)}
            fullWidth
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />
        </Grid2>
        {/* Кнопка добавления предприятия */}
        <Grid2 item xs={12} sm={4} md={2}>
          <Button variant="contained" color="primary" onClick={handleAddPredpr} fullWidth>
            Добавить предприятие
          </Button>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Предприятие</Typography></TableCell>
              <TableCell align="right"><Typography variant="h6">Действия</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predpr.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" color="secondary" onClick={() => handleDeletePredpr(item.id)}>
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
