import axios from 'axios';

// Instância base do Axios configurada para a sua API .NET
const HTTPClient = axios.create({
    baseURL: 'http://localhost:5247/api', // Substitua pela porta correta do seu backend se mudar
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar o token de autenticação (JWT)
// Lembrete: A API tem [Authorize], então precisaremos enviar o Token quando tivermos a tela de Login
HTTPClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default HTTPClient;
