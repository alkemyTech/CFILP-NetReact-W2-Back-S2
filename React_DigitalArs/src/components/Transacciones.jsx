// src/App.jsx
import { useEffect, useState } from 'react';

function Transacciones() {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    fetch('/api/transacciones') // cambiar /api/X por la ruta correcta
      .then(response => response.json())
      .then(data => setTransacciones(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Transacciones</h1>
      <ul>
        {transacciones.map(t => <li key={t.transaccionId}>Monto Transaccion: {t.monto}, Fecha Transaccion: {t.fecha}, Descripcion: {t.descripcion}, Estado: {t.estado}, Tipo de Transaccion: {t.tipoTransaccion}, ID Cuenta Origen: {t.cuentaOrigenId}, ID Cuenta Destino: {t.cuentaDestinoId}</li>)}
      </ul>
    </div>
  );
}

export default Transacciones;
