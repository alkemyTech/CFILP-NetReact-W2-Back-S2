import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import UsuarioPage from './UsuarioPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


