// src/pages/UsuarioTransferencia.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsuarioTransferencia.css';

const UsuarioTransferencia = () => {
  const navigate = useNavigate();
  const [monto, setMonto] = useState('');
  const [destinatario, setDestinatario] = useState('');

  const realizarTransferencia = () => {
    if (!monto || !destinatario) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    alert(`Transferencia de $${monto} realizada a ${destinatario}`);
    setMonto('');
    setDestinatario('');
    navigate('/usuario'); // o donde desees volver luego
  };

  return (
    <div className="transfer-page">
      <h2>Realizar Transferencia</h2>
      <div className="transfer-form">
        <input
          type="text"
          placeholder="Destinatario"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
        <button onClick={realizarTransferencia}>Enviar</button>
        <button className="volver-btn" onClick={() => navigate(-1)}>Volver</button>
      </div>
    </div>
  );
};

export default UsuarioTransferencia;
