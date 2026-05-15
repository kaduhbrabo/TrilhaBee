import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/authAPI';
import { FaForumbee } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const resposta = await authAPI.loginAsync(email, senha);
            if (resposta.token) {
                localStorage.setItem('token', resposta.token);
                localStorage.setItem('usuarioNome', resposta.usuario);
                localStorage.setItem('usuarioID', resposta.usuarioID);
                navigate('/inicio');
            }
        } catch (err) {
            setErro('E-mail ou senha inválidos. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.brand}>
                    <FaForumbee className={styles.brandIcon} />
                    <h2>TrilhaBee</h2>
                </div>
                <p className={styles.subtitle}>Acesse seu painel de apicultura</p>
                
                {erro && <div className={styles.errorAlert}>{erro}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label>E-mail</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label>Senha</label>
                        <input 
                            type="password" 
                            required 
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button type="submit" className={styles.btnLogin} disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
