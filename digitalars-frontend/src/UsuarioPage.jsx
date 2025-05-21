import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UsuarioPage.css';

const UsuarioPage = () => {
  const navigate = useNavigate();

  const handleDepositar = () => alert('Funcionalidad de depósito próximamente');
  const handleRetirar = () => alert('Funcionalidad de retiro próximamente');
  const handleLogout = () => navigate('/login');

  return (
    <div className="page-container">
      <aside className="sidebar">
        <div className="logo">DigitalArs</div>
        <div className="user-icon">👤</div>
        <nav className="menu">
          <button>Transferencia</button>
          <button onClick={handleDepositar}>Depositar</button>
          <button onClick={handleRetirar}>Retirar</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="wallet-header">
          <h1>Mi Cuenta</h1>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </header>

        <section className="wallet-balance">
          <p>Saldo</p>
          <h2>$3,264</h2>
        </section>

        <section className="wallet-transactions">
          <h3>Transacciones Recientes</h3>
          <ul>
            <li>
              <span>Transferencia a Juan Pérez</span>
              <span>-$5,000</span>
            </li>
            <li>
              <span>Recibido de María López</span>
              <span>+$10,000</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default UsuarioPage;