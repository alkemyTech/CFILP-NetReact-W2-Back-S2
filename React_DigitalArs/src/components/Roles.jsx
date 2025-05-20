// src/App.jsx
import { useEffect, useState } from 'react';

function Roles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch('/api/roles') // cambiar /api/X por la ruta correcta
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Roles</h1>
      <ul>
        {roles.map(t => <li key={t.rolId}>{t.rolNombre}</li>)}
      </ul>
    </div>
  );
}

export default Roles;
