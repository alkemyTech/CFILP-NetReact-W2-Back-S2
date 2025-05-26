import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Paper,
} from '@mui/material';
import axios from 'axios';

const AdminTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);

  const fetchTransacciones = async () => {
    try {
      const response = await axios.get('https://localhost:7199/api/Transacciones');
      setTransacciones(response.data);
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const handleEliminar = async (id) => {
    const confirmado = window.confirm('¿Estás seguro de eliminar esta transacción?');
    if (!confirmado) return;

    try {
      await axios.delete(`https://localhost:7199/api/Transacciones/${id}`);
      alert('Transacción eliminada correctamente');
      fetchTransacciones();
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      alert('Error al eliminar la transacción');
    }
  };

  const handleEditar = (id) => {
    alert(`Editar transacción con ID: ${id}`);
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Transacciones
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total: {transacciones.length}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transacciones.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.transaccionId}</TableCell>
                <TableCell>{new Date(tx.fecha).toLocaleString()}</TableCell>
                <TableCell>${tx.monto.toFixed(2)}</TableCell>
                <TableCell>{tx.descripcion}</TableCell>
                <TableCell>{tx.tipoTransaccion}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                    color="primary"
                    onClick={() => handleEditar(tx.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleEliminar(tx.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminTransacciones;