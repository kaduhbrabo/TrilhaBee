import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './paginas/Login/Login';
import Inicio from './paginas/Inicio/Inicio';
import Apiarios from './paginas/Apiarios/Apiarios';
import Colmeias from './paginas/Colmeias/Colmeias';
import Inspecoes from './paginas/Inspecoes/Inspecoes';
import Alertas from './paginas/Alertas/Alertas';
import Perfil from './paginas/Perfil/Perfil';
import Colheita from './paginas/Colheita/Colheita';

const RotaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Raiz → Dashboard */}
                <Route path="/" element={<Navigate to="/inicio" replace />} />

                {/* Rota Pública */}
                <Route path="/login" element={<Login />} />

                {/* Rotas Privadas */}
                <Route path="/inicio"    element={<RotaPrivada><Inicio /></RotaPrivada>} />
                <Route path="/apiarios"  element={<RotaPrivada><Apiarios /></RotaPrivada>} />
                <Route path="/colmeias"  element={<RotaPrivada><Colmeias /></RotaPrivada>} />
                <Route path="/inspecoes" element={<RotaPrivada><Inspecoes /></RotaPrivada>} />
                <Route path="/alertas"   element={<RotaPrivada><Alertas /></RotaPrivada>} />
                <Route path="/perfil"    element={<RotaPrivada><Perfil /></RotaPrivada>} />
                <Route path="/colheita"  element={<RotaPrivada><Colheita /></RotaPrivada>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
