import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle, FaCheckCircle, FaFilter } from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import { alertaIaAPI } from '../../services/alertaIaAPI';
import { colmeiaAPI } from '../../services/colmeiaAPI';
import styles from './Alertas.module.css';

const Alertas = () => {
    const [alertas, setAlertas] = useState([]);
    const [colmeias, setColmeias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('pendentes'); // 'pendentes', 'resolvidos', 'todos'
    const [resolvendo, setResolvendo] = useState(null);

    useEffect(() => { carregarDados(); }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [dadosAlertas, dadosColmeias] = await Promise.all([
                alertaIaAPI.listarAsync().catch(() => []),
                colmeiaAPI.listarAsync().catch(() => [])
            ]);
            setAlertas(dadosAlertas);
            setColmeias(dadosColmeias);
        } catch (e) {
            console.error('Erro ao carregar alertas', e);
        } finally {
            setCarregando(false);
        }
    };

    const getNomeColmeia = (id) => {
        const c = colmeias.find(c => c.colmeiaID === id);
        return c ? c.identificacao : `Colmeia #${id}`;
    };

    const resolverAlerta = async (id) => {
        setResolvendo(id);
        try {
            await alertaIaAPI.resolverAsync(id);
            setAlertas(prev => prev.map(a =>
                a.alertaIAID === id ? { ...a, resolvido: true } : a
            ));
        } catch {
            alert('Erro ao marcar como resolvido.');
        } finally {
            setResolvendo(null);
        }
    };

    const alertasFiltrados = alertas.filter(a => {
        if (filtro === 'pendentes') return !a.resolvido;
        if (filtro === 'resolvidos') return a.resolvido;
        return true;
    });

    const pendentes = alertas.filter(a => !a.resolvido).length;
    const resolvidos = alertas.filter(a => a.resolvido).length;

    const nivelClasse = (nivel) => {
        if (nivel === 'Alto') return styles.alto;
        if (nivel === 'Médio') return styles.medio;
        return styles.baixo;
    };

    return (
        <Topbar>
            <div className={styles.pagina}>
                <div className={styles.cabecalho}>
                    <div>
                        <h2 className={styles.titulo}>Alertas de Inteligência Artificial</h2>
                        <p className={styles.subtitulo}>Recomendações geradas com base nas inspeções das colmeias</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className={styles.filtros}>
                    <button
                        className={`${styles.filtroBotao} ${filtro === 'pendentes' ? styles.filtroAtivo : ''}`}
                        onClick={() => setFiltro('pendentes')}
                    >
                        <FaExclamationTriangle className="me-1" />
                        Pendentes
                        {pendentes > 0 && <span className={styles.badge}>{pendentes}</span>}
                    </button>
                    <button
                        className={`${styles.filtroBotao} ${filtro === 'resolvidos' ? styles.filtroAtivo : ''}`}
                        onClick={() => setFiltro('resolvidos')}
                    >
                        <FaCheckCircle className="me-1" />
                        Resolvidos
                        {resolvidos > 0 && <span className={styles.badgeVerde}>{resolvidos}</span>}
                    </button>
                    <button
                        className={`${styles.filtroBotao} ${filtro === 'todos' ? styles.filtroAtivo : ''}`}
                        onClick={() => setFiltro('todos')}
                    >
                        <FaFilter className="me-1" />
                        Todos ({alertas.length})
                    </button>
                </div>

                {/* Lista */}
                {carregando ? (
                    <div className={styles.loading}>
                        <Spinner animation="border" style={{ color: '#fbbc05' }} />
                    </div>
                ) : alertasFiltrados.length === 0 ? (
                    <div className={styles.vazio}>
                        <FaCheckCircle className={styles.vazioIcone} />
                        <strong>
                            {filtro === 'pendentes' ? 'Nenhum alerta pendente!' : 'Nenhum alerta encontrado.'}
                        </strong>
                        <span>{filtro === 'pendentes' ? 'Tudo sob controle por aqui.' : 'Tente outro filtro.'}</span>
                    </div>
                ) : (
                    <div className={styles.lista}>
                        {alertasFiltrados.map(alerta => (
                            <div
                                key={alerta.alertaIAID}
                                className={`${styles.card} ${alerta.resolvido ? styles.cardResolvido : ''} ${nivelClasse(alerta.nivelGravidade)}`}
                            >
                                <div className={styles.cardTopo}>
                                    <div className={styles.cardEsquerda}>
                                        <span className={`${styles.nivelBadge} ${nivelClasse(alerta.nivelGravidade)}`}>
                                            <FaExclamationTriangle className="me-1" />
                                            Risco {alerta.nivelGravidade}
                                        </span>
                                        <strong className={styles.colmeiaNome}>
                                            {getNomeColmeia(alerta.colmeiaID)}
                                        </strong>
                                    </div>
                                    <span className={styles.data}>
                                        {new Date(alerta.dataGeracao).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                <p className={styles.mensagem}>{alerta.mensagem}</p>

                                <div className={styles.cardRodape}>
                                    {alerta.resolvido ? (
                                        <span className={styles.resolvidoTag}>
                                            <FaCheckCircle className="me-1" /> Resolvido
                                        </span>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className={styles.btnResolver}
                                            onClick={() => resolverAlerta(alerta.alertaIAID)}
                                            disabled={resolvendo === alerta.alertaIAID}
                                        >
                                            {resolvendo === alerta.alertaIAID ? 'Resolvendo...' : (
                                                <><FaCheckCircle className="me-1" /> Marcar como Resolvido</>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Topbar>
    );
};

export default Alertas;
