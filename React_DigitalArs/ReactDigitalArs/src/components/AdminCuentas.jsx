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

const AdminCuentas = () => {
  const [cuentas, setCuentas] = useState([]);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('https://localhost:7199/api/Cuentas');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener cuentas:', error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  const handleEditar = (id) => {
    alert(`Editar cuenta con ID: ${id}`);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cuenta?')) return;

    try {
      await axios.delete(`https://localhost:7199/api/Cuentas/${id}`);
      fetchCuentas();
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Cuentas
      </Typography>
      <br />
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total de cuentas: {cuentas.length}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID Usuario</TableCell>
              <TableCell>Saldo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentas.map((cuenta) => (
              <TableRow key={cuenta.id}>
                <TableCell>{cuenta.usuarioId}</TableCell>
                <TableCell>${cuenta.saldo.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditar(cuenta.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleEliminar(cuenta.id)}
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

export default AdminCuentas;