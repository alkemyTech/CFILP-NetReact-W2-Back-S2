// src/App.jsx
import { useEffect, useState } from 'react';

function Cuentas() {
    const [cuentas, setCuentas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
    Promise.all([
        fetch('/api/cuentas').then(res => res.json()),
        fetch('/api/usuarios').then(res => res.json())
    ])
    .then(([cuentasData, usuariosData]) => {
        const cuentasConNombres = cuentasData.map(c => {
        const usuario = usuariosData.find(u => u.usuarioId === c.usuarioId);
        return {
            ...c,
            nombreUsuario: usuario ? usuario.nombre : 'Desconocido'
        };
        });

        setCuentas(cuentasConNombres);
    })
    .catch(err => console.error(err));
    }, []);

    return (
        <div>
        <h1>Cuentas</h1>
        <ul>
            {cuentas.map(c => <li key={c.cuentaId}>{c.nombreUsuario}, Tipo Moneda: {c.moneda}, Saldo: {c.saldo}, Fecha Creacion Cuenta: {c.fechaCreacion}</li>)}
        </ul>
        </div>
  );
}

export default Cuentas;
