import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import {
    FaForumbee, FaCheckCircle, FaExclamationTriangle,
    FaClipboardCheck, FaChevronRight,
    FaArrowRight, FaChartLine
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Topbar from '../../componentes/Topbar/Topbar';
import { colmeiaAPI } from '../../services/colmeiaAPI';
import { alertaIaAPI } from '../../services/alertaIaAPI';
import { inspecaoAPI } from '../../services/inspecaoAPI';
import { apiarioAPI } from '../../services/apiarioAPI';
import styles from './Inicio.module.css';

// Agrupa inspecoes por mes para o gráfico
const agruparPorMes = (inspecoes) => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const contagem = {};
    inspecoes.forEach(i => {
        const mes = meses[new Date(i.dataInspecao).getMonth()];
        contagem[mes] = (contagem[mes] || 0) + 1;
    });
    return meses
        .map(m => ({ mes: m, inspeções: contagem[m] || 0 }))
        .filter(item => item.inspeções > 0)
        .slice(-6);
};

const Inicio = () => {
    const usuarioNome = localStorage.getItem('usuarioNome') || 'Apicultor';
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [stats, setStats] = useState({
        totalColmeias: 0,
        colmeiasAtivas: 0,
        alertasPendentes: 0,
        inspecoesMes: 0,
        totalApiarios: 0,
    });
    const [alertasRecentes, setAlertasRecentes] = useState([]);
    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [estimativaSafra, setEstimativaSafra] = useState(0);

    useEffect(() => {
        const carregar = async () => {
            try {
                setCarregando(true);
                const [colmeias, alertas, inspecoes, apiarios] = await Promise.all([
                    colmeiaAPI.listarAsync().catch(() => []),
                    alertaIaAPI.listarAsync().catch(() => []),
                    inspecaoAPI.listarAsync().catch(() => []),
                    apiarioAPI.listarAsync().catch(() => []),
                ]);

                const mesAtual = new Date().getMonth();
                const inspecoesMes = inspecoes.filter(
                    i => new Date(i.dataInspecao).getMonth() === mesAtual
                ).length;

                setStats({
                    totalColmeias: colmeias.length,
                    colmeiasAtivas: colmeias.filter(c => c.ativa).length,
                    alertasPendentes: alertas.filter(a => !a.resolvido).length,
                    inspecoesMes,
                    totalApiarios: apiarios.length,
                });

                setAlertasRecentes(alertas.filter(a => !a.resolvido).slice(0, 5));

                const totalEstimativa = colmeias
                    .filter(c => c.ativa && c.quantidadeMelgueiras > 0)
                    .reduce((acc, c) => acc + (c.quantidadeMelgueiras * 12.5), 0);
                setEstimativaSafra(Math.round(totalEstimativa));

                setDadosGrafico(agruparPorMes(inspecoes));
            } catch (e) {
                console.error('Erro ao carregar dashboard', e);
            } finally {
                setCarregando(false);
            }
        };
        carregar();
    }, []);

    const statCards = [
        { label: 'Total de Colmeias',  valor: stats.totalColmeias,    sub: `${stats.totalApiarios} apiários gerenciados`,            icon: <FaForumbee />,          cor: 'laranja', rota: '/colmeias'  },
        { label: 'Colmeias Ativas',    valor: stats.colmeiasAtivas,   sub: `${stats.totalColmeias - stats.colmeiasAtivas} inativas`,  icon: <FaCheckCircle />,       cor: 'verde',   rota: '/colmeias'  },
        { label: 'Recomendações',valor: stats.alertasPendentes, sub: 'Requerem atenção',                                        icon: <FaExclamationTriangle />,cor: stats.alertasPendentes > 0 ? 'rosa' : 'verde', rota: '/alertas' },
        { label: 'Inspeções este Mês', valor: stats.inspecoesMes,     sub: 'Registros do mês atual',                                  icon: <FaClipboardCheck />,    cor: 'amarelo', rota: '/inspecoes' },
        { label: 'Previsão Safra',     valor: `${estimativaSafra}kg`,sub: 'Estimativa de produção',                                  icon: <FaChartLine />,         cor: 'roxo',    rota: '/colheita'  },
    ];

    // O disparo da IA agora é feito exclusivamente pelo backend ao salvar uma Inspeção

    const nivelCor = (nivel) => {
        if (nivel === 'Alta') return styles.nivelAlto;
        if (nivel === 'Media') return styles.nivelMedio;
        if (nivel === 'Sugestão' || nivel === 'Parecer') return styles.nivelSugestao;
        return styles.nivelBaixo;
    };

    if (carregando) {
        return (
            <Topbar>
                <div className={styles.loadingWrap}>
                    <Spinner animation="border" style={{ color: '#fbbc05' }} />
                    <p>Carregando painel...</p>
                </div>
            </Topbar>
        );
    }

    return (
        <Topbar>
            <div className={styles.pagina}>
                {/* Saudação */}
                <div className={styles.saudacao}>
                    <h1 className={styles.titulo}>Olá, {usuarioNome}!</h1>
                    <p className={styles.subtitulo}>Vamos cuidar do seu apiário hoje</p>
                </div>

                {/* Cards de Estatísticas — agora funcionam como Acesso Rápido */}
                <div className={styles.statsGrid}>
                    {statCards.map((card) => (
                        <button
                            key={card.label}
                            className={`${styles.statCard} ${styles[card.cor]}`}
                            onClick={() => navigate(card.rota)}
                            title={`Ir para ${card.label}`}
                        >
                            <div className={styles.statIconWrap}>{card.icon}</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{card.label}</span>
                                <strong className={styles.statValor}>{card.valor}</strong>
                                <span className={styles.statSub}>{card.sub}</span>
                            </div>
                            <FaChevronRight className={styles.statSeta} />
                        </button>
                    ))}
                </div>

                {/* Corpo Principal: Gráfico + Alertas */}
                <div className={styles.corpo}>
                    {/* Gráfico de Inspeções */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitulo}>Inspeções por Mês</h3>
                                <p className={styles.cardSub}>Registros dos últimos meses</p>
                            </div>
                            <Link to="/inspecoes" className={styles.cardLink}>
                                Ver todas <FaArrowRight />
                            </Link>
                        </div>
                        <div className={styles.graficoWrap}>
                            {dadosGrafico.length === 0 ? (
                                <div className={styles.semDados}>
                                    <FaClipboardCheck className={styles.semDadosIcon} />
                                    <p>Nenhuma inspeção registrada ainda.</p>
                                    <Link to="/inspecoes" className={styles.linkAction}>
                                        Registrar primeira inspeção
                                    </Link>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={dadosGrafico} barSize={36}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                                        <XAxis dataKey="mes" tick={{ fill: '#8a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fill: '#8a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(251,188,5,0.06)' }}
                                            contentStyle={{ border: '1px solid #f0ede8', borderRadius: '10px', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                                        />
                                        <Bar dataKey="inspeções" fill="#fbbc05" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Painel de Alertas */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitulo}>Ações Recomendadas</h3>
                                <p className={styles.cardSub}>Plano de ação baseado nas suas inspeções recentes</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Link to="/alertas" className={styles.cardLink}>
                                    Ver todos <FaArrowRight />
                                </Link>
                            </div>
                        </div>

                        {alertasRecentes.length === 0 ? (
                            <div className={styles.semDados}>
                                <FaCheckCircle className={styles.semDadosIconVerde} />
                                <p>Nenhuma recomendação pendente.</p>
                                <span className={styles.semDadosSub}>Manejos em dia!</span>
                            </div>
                        ) : (
                            <div className={styles.alertasList}>
                                {alertasRecentes.map(alerta => (
                                    <div key={alerta.alertaIAID} className={styles.alertaItem}>
                                        <div className={`${styles.alertaBadge} ${nivelCor(alerta.nivelGravidade)}`}>
                                            <FaExclamationTriangle />
                                            {alerta.nivelGravidade}
                                        </div>
                                        <p className={styles.alertaMensagem}>{alerta.mensagem}</p>
                                        <div className={styles.alertaRodape}>
                                            <span className={styles.alertaData}>
                                                {new Date(alerta.dataGeracao).toLocaleDateString('pt-BR')}
                                            </span>
                                            <Link to="/alertas" className={styles.alertaLink}>
                                                Manejo Realizado <FaChevronRight />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Topbar>
    );
};

export default Inicio;
