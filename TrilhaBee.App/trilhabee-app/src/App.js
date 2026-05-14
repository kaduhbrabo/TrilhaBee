import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Apiarios from './paginas/Apiarios/Apiarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/apiarios" replace />} />
        <Route path="/apiarios" element={<Apiarios />} />
        {/* Futuras rotas serão adicionadas aqui */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
