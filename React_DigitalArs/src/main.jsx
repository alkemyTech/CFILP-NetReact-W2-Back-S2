import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Roles from './components/Roles.jsx'
import Usuarios from './components/Usuarios.jsx'
import Cuentas from './components/Cuentas.jsx'
import Transacciones from './components/Transacciones.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Roles />
    <Usuarios />
    <Cuentas />
    <Transacciones />
  </StrictMode>,
)
