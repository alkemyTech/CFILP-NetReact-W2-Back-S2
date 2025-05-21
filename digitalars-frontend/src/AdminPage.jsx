import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const usuariosDemo = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', estado: 'Activo' },
  { id: 2, nombre: 'María López', email: 'maria@mail.com', estado: 'Bloqueado' },
  { id: 3, nombre: 'Carlos Díaz', email: 'carlos@mail.com', estado: 'Activo' },
];

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí limpiar estado o tokens si tienes
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">DigitalArs Admin</div>
        <nav className="admin-menu">
          <button>Usuarios</button>
          <button>Estadísticas</button>
          <button>Configuración</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Panel de Administración</h1>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </header>

        <section className="admin-stats">
          <div className="stat-card">
            <h3>Usuarios Totales</h3>
            <p>{usuariosDemo.length}</p>
          </div>
          <div className="stat-card">
            <h3>Usuarios Activos</h3>
            <p>{usuariosDemo.filter(u => u.estado === 'Activo').length}</p>
          </div>
          <div className="stat-card">
            <h3>Transacciones Hoy</h3>
            <p>124</p>
          </div>
        </section>

        <section className="admin-users">
          <h2>Lista de Usuarios</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosDemo.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.estado}</td>
                  <td>
                    <button>Editar</button>
                    <button>Bloquear</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;