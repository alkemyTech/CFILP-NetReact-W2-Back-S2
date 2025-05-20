// src/App.jsx
import { useEffect, useState } from 'react';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('/api/usuarios') // cambiar /api/X por la ruta correcta
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {usuarios.map(t => <li key={t.usuarioId}>{t.nombre} {t.apellido}, DNI: {t.dni}, Correo: {t.email}, Rol: {t.rolNombre}</li>)}
      </ul>
    </div>
  );
}

export default Usuarios;
