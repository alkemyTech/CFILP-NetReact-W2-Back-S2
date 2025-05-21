import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Asegurate de crear este archivo y vincularlo

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://localhost:7199/api/auth/loginUsuario', {
        username: username.trim(),
        password: password.trim(),
      });

      const { token, nombre, usuarioId, rol } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('usuarioId', usuarioId);
      localStorage.setItem('rol', rol);

      alert('Login exitoso');

      if (rol === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/logo.svg" alt="Logo DigitalArs" className="login-logo" />
        <p className="login-subtitle">Iniciar Sesión</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Entrar</button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;




