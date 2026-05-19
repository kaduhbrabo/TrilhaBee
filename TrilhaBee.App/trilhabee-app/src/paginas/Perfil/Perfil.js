import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserCircle, FaCheck, FaPalette, FaSignOutAlt,
    FaEdit, FaSave, FaTimes, FaShieldAlt
} from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import { useTema, TEMAS } from '../../context/ThemeContext';
import styles from './Perfil.module.css';

const Perfil = () => {
    const navigate = useNavigate();
    const { tema, setTema } = useTema();

    const [nomeAtual, setNomeAtual] = useState(localStorage.getItem('usuarioNome') || 'Apicultor');
    const [editandoNome, setEditandoNome] = useState(false);
    const [novoNome, setNovoNome] = useState(nomeAtual);
    const [nomeSalvo, setNomeSalvo] = useState(false);

    const salvarNome = () => {
        const trimmed = novoNome.trim();
        if (!trimmed) return;
        localStorage.setItem('usuarioNome', trimmed);
        setNomeAtual(trimmed);
        setEditandoNome(false);
        setNomeSalvo(true);
        setTimeout(() => setNomeSalvo(false), 2000);
    };

    const cancelarEdicao = () => {
        setNovoNome(nomeAtual);
        setEditandoNome(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioNome');
        localStorage.removeItem('usuarioID');
        navigate('/login');
    };

    return (
        <Topbar>
            <div className={styles.pagina}>
                <div className={styles.cabecalho}>
                    <h1 className={styles.titulo}>Meu Perfil</h1>
                    <p className={styles.subtitulo}>Gerencie suas informações e preferências</p>
                </div>

                <div className={styles.grid}>
                    {/* Card: Identidade */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FaUserCircle className={styles.cardIcone} />
                            <h2 className={styles.cardTitulo}>Identificação</h2>
                        </div>

                        <div className={styles.avatarWrap}>
                            <div className={styles.avatar}>
                                <FaUserCircle />
                            </div>
                            <div className={styles.avatarInfo}>
                                <strong className={styles.avatarNome}>{nomeAtual}</strong>
                                <span className={styles.avatarRole}>Apicultor</span>
                            </div>
                        </div>

                        <div className={styles.campo}>
                            <label className={styles.campoLabel}>Nome de exibição</label>
                            {editandoNome ? (
                                <div className={styles.campoEdicao}>
                                    <input
                                        className={styles.campoInput}
                                        value={novoNome}
                                        onChange={e => setNovoNome(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') salvarNome(); if (e.key === 'Escape') cancelarEdicao(); }}
                                        autoFocus
                                        placeholder="Seu nome"
                                    />
                                    <button className={styles.btnSalvar} onClick={salvarNome} title="Salvar">
                                        <FaSave />
                                    </button>
                                    <button className={styles.btnCancelar} onClick={cancelarEdicao} title="Cancelar">
                                        <FaTimes />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.campoEdicao}>
                                    <span className={styles.campoValor}>{nomeAtual}</span>
                                    <button className={styles.btnEditar} onClick={() => setEditandoNome(true)} title="Editar nome">
                                        <FaEdit />
                                    </button>
                                </div>
                            )}
                            {nomeSalvo && (
                                <span className={styles.feedbackSalvo}>
                                    <FaCheck /> Nome salvo com sucesso!
                                </span>
                            )}
                        </div>

                        <div className={styles.infoRow}>
                            <FaShieldAlt className={styles.infoIcon} />
                            <span>O nome é salvo localmente no dispositivo</span>
                        </div>
                    </div>

                    {/* Card: Tema */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FaPalette className={styles.cardIcone} />
                            <h2 className={styles.cardTitulo}>Aparência</h2>
                        </div>

                        <p className={styles.cardDescricao}>
                            Escolha o tema que melhor combina com seu estilo de trabalho.
                        </p>

                        <div className={styles.temasGrid}>
                            {Object.entries(TEMAS).map(([chave, config]) => (
                                <button
                                    key={chave}
                                    className={`${styles.temaCard} ${tema === chave ? styles.temaAtivo : ''}`}
                                    onClick={() => setTema(chave)}
                                >
                                    <span className={styles.temaLabel}>{config.label}</span>
                                    {tema === chave && (
                                        <span className={styles.temaBadge}>
                                            <FaCheck />
                                        </span>
                                    )}
                                    <div className={styles.temaPreview} data-tema-preview={chave} />
                                </button>
                            ))}
                        </div>

                        <p className={styles.temaAtualLabel}>
                            Tema atual: <strong>{TEMAS[tema]?.label}</strong>
                        </p>
                    </div>

                    {/* Card: Sessão */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FaSignOutAlt className={styles.cardIcone} style={{ color: '#ef4444' }} />
                            <h2 className={styles.cardTitulo}>Sessão</h2>
                        </div>

                        <p className={styles.cardDescricao}>
                            Você está autenticado no TrilhaBee. Ao sair, será necessário fazer login novamente.
                        </p>

                        <button className={styles.btnLogout} onClick={handleLogout}>
                            <FaSignOutAlt />
                            Sair da conta
                        </button>
                    </div>
                </div>
            </div>
        </Topbar>
    );
};

export default Perfil;

