import React, { useState, useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar
} from 'recharts';
import { FaChartLine, FaTint, FaInfoCircle, FaBoxOpen } from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import { colmeiaAPI } from '../../services/colmeiaAPI';
import { inspecaoAPI } from '../../services/inspecaoAPI';
import styles from './Colheita.module.css';

const Colheita = () => {
    const [carregando, setCarregando] = useState(true);
    const [estimativas, setEstimativas] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [rankingProducao, setRankingProducao] = useState([]);
    const [totalEstimado, setTotalEstimado] = useState(0);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [colmeias, inspecoes] = await Promise.all([
                colmeiaAPI.listarAsync().catch(() => []),
                inspecaoAPI.listarAsync().catch(() => [])
            ]);

            // Calcula Estimativas (12.5kg por melgueira) apenas para ativas
            let tEstimado = 0;
            const estimativasCalculadas = colmeias
                .filter(c => c.ativa)
                .map(c => {
                    const kg = (c.quantidadeMelgueiras || 0) * 12.5;
                    tEstimado += kg;
                    return {
                        id: c.colmeiaID,
                        nome: c.identificacao,
                        tipo: c.tipoAbelha,
                        melgueiras: c.quantidadeMelgueiras || 0,
                        estimativaKg: kg
                    };
                })
                .sort((a, b) => b.estimativaKg - a.estimativaKg);
            
            setEstimativas(estimativasCalculadas);
            setTotalEstimado(tEstimado);

            // Calcula Histórico usando as novas propriedades
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const histMeses = {};
            const prodPorColmeia = {};
            
            inspecoes.forEach(insp => {
                if (insp.melColetado && insp.melColetado > 0) {
                    const kg = insp.melColetado;
                    const dataReal = insp.dataColheita || insp.dataInspecao;
                    const mesIdx = new Date(dataReal).getMonth();
                    const mesNome = meses[mesIdx];
                    histMeses[mesNome] = (histMeses[mesNome] || 0) + kg;

                    // Para o ranking
                    const colmeiaNome = colmeias.find(c => c.colmeiaID === insp.colmeiaID)?.identificacao || `ID ${insp.colmeiaID}`;
                    prodPorColmeia[colmeiaNome] = (prodPorColmeia[colmeiaNome] || 0) + kg;
                }
            });

            const rankingArray = Object.keys(prodPorColmeia).map(k => ({
                colmeia: k,
                producao: prodPorColmeia[k]
            })).sort((a, b) => b.producao - a.producao);
            setRankingProducao(rankingArray);

            // Converte para array pro recharts (últimos 6 meses que tem dados, ou na ordem do ano)
            const histArray = meses
                .map(m => ({ mes: m, producao: histMeses[m] || 0 }))
                .filter(item => item.producao > 0 || meses.indexOf(item.mes) >= new Date().getMonth() - 5);
            
            setHistorico(histArray.slice(-6));

        } catch (error) {
            console.error("Erro ao carregar dados de colheita:", error);
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return (
            <Topbar>
                <div className={styles.loadingWrap}>
                    <Spinner animation="border" style={{ color: '#fbbc05' }} />
                    <p>Calculando estimativas de safra...</p>
                </div>
            </Topbar>
        );
    }

    return (
        <Topbar>
            <div className={styles.pagina}>
                <div className={styles.cabecalho}>
                    <div>
                        <h1 className={styles.titulo}>Colheita e Produção</h1>
                        <p className={styles.subtitulo}>Acompanhe o histórico de extração e a estimativa da próxima safra</p>
                    </div>
                </div>

                <div className={styles.resumoGrid}>
                    <div className={styles.resumoCard}>
                        <div className={styles.resumoIconeWrap} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                            <FaChartLine />
                        </div>
                        <div className={styles.resumoInfo}>
                            <span className={styles.resumoLabel}>Estimativa Total</span>
                            <strong className={styles.resumoValor}>~{totalEstimado} kg</strong>
                            <span className={styles.resumoSub}>Próxima safra (12.5kg/melgueira)</span>
                        </div>
                    </div>
                    
                    <div className={styles.resumoCard}>
                        <div className={styles.resumoIconeWrap} style={{ background: '#fffbeb', color: '#f59e0b' }}>
                            <FaTint />
                        </div>
                        <div className={styles.resumoInfo}>
                            <span className={styles.resumoLabel}>Histórico de Produção</span>
                            <strong className={styles.resumoValor}>
                                {historico.reduce((acc, curr) => acc + curr.producao, 0)} kg
                            </strong>
                            <span className={styles.resumoSub}>Últimos 6 meses</span>
                        </div>
                    </div>
                </div>

                <div className={styles.corpo}>
                    {/* Gráfico de Produção */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitulo}>Produção Mensal (kg)</h2>
                            <p className={styles.cardSub}>Volume de mel extraído registrado nas inspeções</p>
                        </div>
                        <div className={styles.graficoWrap}>
                            {historico.every(h => h.producao === 0) ? (
                                <div className={styles.semDados}>
                                    <FaBoxOpen className={styles.semDadosIcon} />
                                    <p>Nenhum registro de colheita encontrado.</p>
                                    <span>Adicione [Colheita: Xkg] nas observações de inspeção para registrar.</span>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={historico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#fbbc05" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#fbbc05" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                                        <XAxis dataKey="mes" tick={{ fill: '#8a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fill: '#8a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ border: '1px solid #f0ede8', borderRadius: '10px', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                                        />
                                        <Area type="monotone" dataKey="producao" stroke="#fbbc05" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Gráfico de Produção por Colmeia */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitulo}>Rendimento por Colmeia (kg)</h2>
                            <p className={styles.cardSub}>Total de mel colhido de cada colmeia (Ranking)</p>
                        </div>
                        <div className={styles.graficoWrap}>
                            {rankingProducao.length === 0 ? (
                                <div className={styles.semDados}>
                                    <FaBoxOpen className={styles.semDadosIcon} />
                                    <p>Nenhum registro de colheita associado a colmeias.</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={rankingProducao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" horizontal={true} vertical={false} />
                                        <XAxis type="number" tick={{ fill: '#8a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="colmeia" type="category" tick={{ fill: '#8a8fa8', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                                        <Tooltip 
                                            contentStyle={{ border: '1px solid #f0ede8', borderRadius: '10px', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                                            cursor={{fill: 'rgba(251, 188, 5, 0.1)'}}
                                        />
                                        <Bar dataKey="producao" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>


                    {/* Tabela de Estimativas */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitulo}>Estimativa por Colmeia</h2>
                            <p className={styles.cardSub}>Baseado no número de melgueiras instaladas atualmente</p>
                        </div>
                        <div className={styles.tabelaContainer}>
                            <Table hover responsive className={styles.tabela}>
                                <thead>
                                    <tr>
                                        <th>Identificação</th>
                                        <th>Espécie</th>
                                        <th className="text-center">Melgueiras</th>
                                        <th className="text-end">Estimativa (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estimativas.map(est => (
                                        <tr key={est.id}>
                                            <td className="fw-bold">{est.nome}</td>
                                            <td><span className={styles.badgeEspecie}>{est.tipo}</span></td>
                                            <td className="text-center">{est.melgueiras}</td>
                                            <td className="text-end fw-bold" style={{ color: est.estimativaKg > 0 ? '#10b981' : '#8a8fa8' }}>
                                                {est.estimativaKg > 0 ? `~${est.estimativaKg} kg` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {estimativas.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">Nenhuma colmeia ativa cadastrada.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </Topbar>
    );
};

export default Colheita;
