import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
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
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [roles, setRoles] = useState([]);

  

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://localhost:7199/api/Usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await fetch('https://localhost:7199/api/Roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);



  const handleEliminar = async (id) => {
    alert("Aun no implementado")
    // const confirmado = window.confirm('¿Estás seguro de eliminar este usuario?');
    // if (!confirmado) return;

    // try {
    //   await axios.delete(`https://localhost:7199/api/Usuarios/${id}`);
    //   alert('Usuario eliminado correctamente');
    //   fetchUsuarios();
    // } catch (error) {
    //   console.error('Error al eliminar usuario:', error);
    //   alert('Error al eliminar el usuario');
    // }
  };

  const handleEditar = (user) => {
    setUsuarioEditar(user);
    setOpenModal(true);
  }

  const handleGuardarCambios = async () => {
    const token = localStorage.getItem('token');
    
    if (!usuarioEditar.nombre || !usuarioEditar.apellido || !usuarioEditar.dni) {
      alert('Por favor completá todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7199/api/Usuarios/${usuarioEditar.usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(usuarioEditar)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al actualizar el usuario.");
      }

      alert('Usuario actualizado correctamente');
      setOpenModal(false);
      fetchUsuarios(); // actualizar lista
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario');}

    // try {
    //   await axios.put(`https://localhost:7199/api/Usuarios/${usuarioEditar.usuarioId}`, usuarioEditar, {headers: { Authorization: `Bearer ${token}`}});
    //   alert('Usuario actualizado correctamente');
    //   setOpenModal(false);
    //   fetchUsuarios(); // Actualizar la tabla
    // } catch (error) {
    //   console.error('Error al actualizar usuario:', error);
    //   alert('Error al actualizar el usuario');
    // }
  };


  return (
    <>
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
                    onClick={() => handleEditar(user)}
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
    <Dialog open={openModal} onClose={() => setOpenModal(false)}>
      <DialogTitle >Editar Usuario</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'visible' }}>
        <TextField
          label="Nombre"
          value={usuarioEditar?.nombre || ''}
          onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })}
          fullWidth
          variant='outlined'
          margin='normal'
          required
        />
        <TextField
          label="Apellido"
          value={usuarioEditar?.apellido || ''}
          onChange={(e) => setUsuarioEditar({ ...usuarioEditar, apellido: e.target.value })}
          fullWidth
          variant='outlined'
          required
        />
        <TextField
          label="DNI"
          value={usuarioEditar?.dni || ''}
          onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,9}$/.test(value)) {
                setUsuarioEditar({ ...usuarioEditar, dni: value });
              }}}
          inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 9,
            }}
          variant='outlined'
          required
        />
        <Select
          label="Rol"
          value={usuarioEditar?.rolId || ''}
          onChange={(e) => {
            const selectedRolId = parseInt(e.target.value);
            const selectedRol = roles.find((rol) => rol.rolId === selectedRolId);

            setUsuarioEditar((prev) => ({
              ...prev,
              rolId: selectedRolId,
              rolNombre: selectedRol?.rolNombre || '',
            }));
          }}
          fullWidth
        >
          {roles.map((rol) => (
            <MenuItem key={rol.rolId} value={rol.rolId}>
              {rol.rolNombre}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardarCambios}>Guardar</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default AdminUsuarios;