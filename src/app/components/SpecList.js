import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useSnackbar } from './SnackbarProvider';

const SpecList = () => {
  const [specs, setSpecs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [orderName, setOrderName] = useState('');
  const [productName, setProductName] = useState('');
  const [kol, setKol] = useState('');
  const { showSnackbar } = useSnackbar();

  // Загрузка данных спецификаций
  const fetchSpecs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/spec');
      setSpecs(response.data);
    } catch (error) {
      showSnackbar('Ошибка при загрузке данных спецификаций.', 'error');
    }
  };

  useEffect(() => {
    fetchSpecs();
  }, []);

  // Обработка формы для добавления или редактирования
  const handleSubmit = async (event) => {
    event.preventDefault();

    const specData = { order_name: orderName, product_name: productName, kol };
    const apiMethod = editingSpec ? axios.put : axios.post;
    const url = editingSpec ? `http://localhost:5000/api/spec/${editingSpec.spec_id}` : 'http://localhost:5000/api/spec';

    try {
      if (editingSpec) {
        await apiMethod(url, specData);
        showSnackbar('Спецификация успешно обновлена!', 'success');
      } else {
        await apiMethod(url, specData);
        showSnackbar('Спецификация успешно добавлена!', 'success');
      }
      setDialogOpen(false);
      setEditingSpec(null);
      fetchSpecs();
    } catch (error) {
      showSnackbar('Ошибка при сохранении спецификации.', 'error');
    }
  };

  // Удаление спецификации
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/spec/${id}`);
      showSnackbar('Спецификация успешно удалена!', 'success');
      fetchSpecs();
    } catch (error) {
      showSnackbar('Ошибка при удалении спецификации.', 'error');
    }
  };

  // Открытие диалога для добавления или редактирования
  const openDialog = (spec = null) => {
    setEditingSpec(spec);
    if (spec) {
      setOrderName(spec.order_name);
      setProductName(spec.product_name);
      setKol(spec.quantity);
    } else {
      setOrderName('');
      setProductName('');
      setKol('');
    }
    setDialogOpen(true);
  };

  // Закрытие диалога
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSpec(null);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => openDialog()}>Добавить спецификацию</Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название заказа</TableCell>
              <TableCell>Название продукта</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specs.map((spec) => (
              <TableRow key={spec.spec_id}>
                <TableCell>{spec.order_name}</TableCell>
                <TableCell>{spec.product_name}</TableCell>
                <TableCell>{spec.quantity}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => openDialog(spec)}>Редактировать</Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(spec.spec_id)}>Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог для добавления или редактирования спецификации */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{editingSpec ? 'Редактировать спецификацию' : 'Добавить спецификацию'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Название заказа"
            fullWidth
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Название продукта"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Количество"
            type="number"
            fullWidth
            value={kol}
            onChange={(e) => setKol(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">Отмена</Button>
          <Button onClick={handleSubmit} color="primary">{editingSpec ? 'Обновить' : 'Добавить'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpecList;
