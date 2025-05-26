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

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://localhost:7199/api/Usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    const confirmado = window.confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmado) return;

    try {
      await axios.delete(`https://localhost:7199/api/Usuarios/${id}`);
      alert('Usuario eliminado correctamente');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Usuarios
      </Typography>
      <br />
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total de usuarios: {usuarios.length}
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.usuarioId}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rolNombre || 'Sin rol'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                    color="primary"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleEliminar(user.id)}
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

export default AdminUsuarios;