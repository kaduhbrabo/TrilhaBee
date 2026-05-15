import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import {
    FaForumbee, FaCheckCircle, FaExclamationTriangle,
    FaClipboardCheck, FaMapMarkerAlt, FaChevronRight,
    FaArrowRight, FaLayerGroup, FaMagic, FaChartLine
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
    // Retorna os últimos 6 meses com dados
    return meses
        .map(m => ({ mes: m, inspeções: contagem[m] || 0 }))
        .filter(item => item.inspeções > 0)
        .slice(-6);
};

const Inicio = () => {
    const usuarioNome = localStorage.getItem('usuarioNome') || 'Apicultor';
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
    const [gerandoIA, setGerandoIA] = useState(false);

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

                setAlertasRecentes(
                    alertas.filter(a => !a.resolvido).slice(0, 5)
                );

                // Calcula estimativa de safra
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
        {
            label: 'Total de Colmeias',
            valor: stats.totalColmeias,
            sub: `${stats.totalApiarios} apiários gerenciados`,
            icon: <FaForumbee />,
            cor: 'laranja',
        },
        {
            label: 'Colmeias Ativas',
            valor: stats.colmeiasAtivas,
            sub: `${stats.totalColmeias - stats.colmeiasAtivas} inativas`,
            icon: <FaCheckCircle />,
            cor: 'verde',
        },
        {
            label: 'Alertas Pendentes',
            valor: stats.alertasPendentes,
            sub: 'Requerem atenção',
            icon: <FaExclamationTriangle />,
            cor: stats.alertasPendentes > 0 ? 'rosa' : 'verde',
        },
        {
            label: 'Inspeções este Mês',
            valor: stats.inspecoesMes,
            sub: 'Registros do mês atual',
            icon: <FaClipboardCheck />,
            cor: 'amarelo',
        },
        {
            label: 'Previsão Safra',
            valor: `~${estimativaSafra}kg`,
            sub: 'Estimativa de produção',
            icon: <FaChartLine />,
            cor: 'roxo',
        },
    ];

    const gerarAnaliseIA = async () => {
        setGerandoIA(true);
        try {
            await alertaIaAPI.gerarAnaliseAsync();
            const alertas = await alertaIaAPI.listarAsync().catch(() => []);
            setAlertasRecentes(alertas.filter(a => !a.resolvido).slice(0, 5));
            setStats(prev => ({ ...prev, alertasPendentes: alertas.filter(a => !a.resolvido).length }));
        } catch(e) {
            alert('Erro ao gerar análise.');
        } finally {
            setGerandoIA(false);
        }
    };

    const nivelCor = (nivel) => {
        if (nivel === 'Alta') return styles.nivelAlto;
        if (nivel === 'Media') return styles.nivelMedio;
        if (nivel === 'Sugestão') return styles.nivelSugestao;
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
                    <div>
                        <h1 className={styles.titulo}>Olá, {usuarioNome}!</h1>
                        <p className={styles.subtitulo}>Vamos cuidar do seu apiário hoje</p>
                    </div>
                </div>

                {/* Cards de Estatísticas */}
                <div className={styles.statsGrid}>
                    {statCards.map((card) => (
                        <div key={card.label} className={`${styles.statCard} ${styles[card.cor]}`}>
                            <div className={styles.statIconWrap}>
                                {card.icon}
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{card.label}</span>
                                <strong className={styles.statValor}>{card.valor}</strong>
                                <span className={styles.statSub}>{card.sub}</span>
                            </div>
                        </div>
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
                                        <XAxis
                                            dataKey="mes"
                                            tick={{ fill: '#8a8fa8', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tick={{ fill: '#8a8fa8', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(251,188,5,0.06)' }}
                                            contentStyle={{
                                                border: '1px solid #f0ede8',
                                                borderRadius: '10px',
                                                fontSize: '13px',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                                            }}
                                        />
                                        <Bar
                                            dataKey="inspeções"
                                            fill="#fbbc05"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Painel de Alertas */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.cardTitulo}>Alertas e Sugestões IA</h3>
                                <p className={styles.cardSub}>Análise inteligente das suas colmeias</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    className={styles.btnGerarIA}
                                    onClick={gerarAnaliseIA}
                                    disabled={gerandoIA}
                                    title="Gerar nova análise IA"
                                >
                                    <FaMagic /> {gerandoIA ? 'Analisando...' : 'Analisar'}
                                </button>
                                <Link to="/alertas" className={styles.cardLink}>
                                    Ver todos <FaArrowRight />
                                </Link>
                            </div>
                        </div>

                        {alertasRecentes.length === 0 ? (
                            <div className={styles.semDados}>
                                <FaCheckCircle className={styles.semDadosIconVerde} />
                                <p>Nenhum alerta pendente.</p>
                                <span className={styles.semDadosSub}>Tudo sob controle!</span>
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
                                                Resolver <FaChevronRight />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Links Rápidos */}
                <div className={styles.acessoRapido}>
                    <h3 className={styles.acessoTitulo}>Acesso Rápido</h3>
                    <div className={styles.acessoGrid}>
                        {[
                            { to: '/apiarios', icon: <FaLayerGroup />, label: 'Apiários', sub: 'Gerenciar locais' },
                            { to: '/colmeias', icon: <FaForumbee />, label: 'Colmeias', sub: 'Ver todas as colmeias' },
                            { to: '/inspecoes', icon: <FaClipboardCheck />, label: 'Inspeções', sub: 'Registrar visita' },
                            { to: '/alertas', icon: <FaExclamationTriangle />, label: 'Alertas IA', sub: 'Ver recomendações' },
                        ].map(item => (
                            <Link key={item.to} to={item.to} className={styles.acessoCard}>
                                <span className={styles.acessoIcone}>{item.icon}</span>
                                <div>
                                    <strong>{item.label}</strong>
                                    <span>{item.sub}</span>
                                </div>
                                <FaChevronRight className={styles.acessoSeta} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Topbar>
    );
};

export default Inicio;
