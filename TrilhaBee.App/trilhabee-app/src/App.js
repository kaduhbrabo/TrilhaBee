import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Apiarios from './paginas/Apiarios/Apiarios';
import Colmeias from './paginas/Colmeias/Colmeias';
import Login from './paginas/Login/Login';

// Componente para proteger as rotas que exigem login
const RotaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/apiarios" replace />} />
        
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Privadas */}
        <Route 
          path="/apiarios" 
          element={
            <RotaPrivada>
              <Apiarios />
            </RotaPrivada>
          } 
        />
        <Route 
          path="/colmeias" 
          element={
            <RotaPrivada>
              <Colmeias />
            </RotaPrivada>
          } 
        />
        
        {/* Futuras rotas serão adicionadas aqui */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
