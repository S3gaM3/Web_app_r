import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";

const InvoiceDetails = ({ invoice, showSnackbar }) => {
  const totalAmount = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Счет № {invoice.number} от {invoice.date}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название товара</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Сумма</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price} ₽</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price * item.quantity} ₽</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Общая сумма: {totalAmount} ₽
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => showSnackbar(`Счет № ${invoice.number} создан!`, "success")}
        sx={{ marginTop: 2 }}
      >
        Завершить заказ
      </Button>
    </div>
  );
};

export default InvoiceDetails;
