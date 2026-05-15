import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { FaPlus, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import ColmeiaCard from '../../componentes/ColmeiaCard/ColmeiaCard';
import { colmeiaAPI } from '../../services/colmeiaAPI';
import { apiarioAPI } from '../../services/apiarioAPI';
import styles from './Colmeias.module.css';

const Colmeias = () => {
    const [colmeias, setColmeias] = useState([]);
    const [apiarios, setApiarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('todas');

    const [mostrarModalDel, setMostrarModalDel] = useState(false);
    const [colmeiaSelecionada, setColmeiaSelecionada] = useState(null);
    const [mostrarModalForm, setMostrarModalForm] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState({ identificacao: '', tipoAbelha: '', ativa: true, apiarioID: '', quantidadeQuadros: 10, quantidadeMelgueiras: 0 });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => { carregarDados(); }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [dadosColmeias, dadosApiarios] = await Promise.all([
                colmeiaAPI.listarAsync(),
                apiarioAPI.listarAsync()
            ]);
            setColmeias(dadosColmeias);
            setApiarios(dadosApiarios);
        } catch (erro) {
            console.error('Falha ao carregar colmeias', erro);
        } finally {
            setCarregando(false);
        }
    };

    const colmeiasFiltradas = colmeias.filter(c => {
        if (filtro === 'ativas') return c.ativa;
        if (filtro === 'inativas') return !c.ativa;
        return true;
    });

    const totalAtivas = colmeias.filter(c => c.ativa).length;
    const totalInativas = colmeias.filter(c => !c.ativa).length;

    const getNomeApiario = (id) => {
        const a = apiarios.find(a => a.apiarioID === id);
        return a ? a.nome : '';
    };

    // Exclusão
    const confirmarExclusao = async () => {
        try {
            await colmeiaAPI.deletarAsync(colmeiaSelecionada.colmeiaID);
            setColmeias(prev => prev.filter(c => c.colmeiaID !== colmeiaSelecionada.colmeiaID));
            setMostrarModalDel(false);
        } catch { alert('Não foi possível excluir.'); }
    };

    // Formulário
    const abrirNovo = () => {
        setModoEdicao(false);
        setFormData({ identificacao: '', tipoAbelha: '', ativa: true, apiarioID: '', quantidadeQuadros: 10, quantidadeMelgueiras: 0 });
        setMostrarModalForm(true);
    };

    const abrirEditar = (c) => {
        setModoEdicao(true);
        setColmeiaSelecionada(c);
        setFormData({
            identificacao: c.identificacao,
            tipoAbelha: c.tipoAbelha,
            ativa: c.ativa,
            apiarioID: c.apiarioID || '',
            quantidadeQuadros: c.quantidadeQuadros || 10,
            quantidadeMelgueiras: c.quantidadeMelgueiras || 0
        });
        setMostrarModalForm(true);
    };

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(p => ({ ...p, [e.target.name]: val }));
    };

    const salvar = async (e) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const payload = {
                ...formData,
                apiarioID: parseInt(formData.apiarioID),
                quantidadeQuadros: parseInt(formData.quantidadeQuadros) || 10,
                quantidadeMelgueiras: parseInt(formData.quantidadeMelgueiras) || 0
            };
            if (modoEdicao) await colmeiaAPI.atualizarAsync(colmeiaSelecionada.colmeiaID, payload);
            else await colmeiaAPI.criarAsync(payload);
            setMostrarModalForm(false);
            carregarDados();
        } catch { alert('Erro ao salvar. Verifique os campos.'); }
        finally { setSalvando(false); }
    };

    return (
        <Topbar>
            <div className={styles.pagina}>
                {/* Cabeçalho */}
                <div className={styles.cabecalho}>
                    <div>
                        <h2 className={styles.titulo}>Minhas Colmeias</h2>
                        <p className={styles.subtitulo}>Gerenciamento completo das colmeias</p>
                    </div>
                    <Button className={styles.btnNovo} onClick={abrirNovo}>
                        <FaPlus className="me-2" /> Adicionar Colmeia
                    </Button>
                </div>

                {/* Mini-cards de resumo (estilo Figma) */}
                <div className={styles.resumoGrid}>
                    <button className={`${styles.resumoCard} ${filtro === 'todas' ? styles.resumoAtivo : ''}`} onClick={() => setFiltro('todas')}>
                        <span className={`${styles.resumoIcone} ${styles.resumoVerde}`}>
                            <FaCheckCircle />
                        </span>
                        <div>
                            <strong>{colmeias.length}</strong>
                            <span>Total</span>
                        </div>
                    </button>
                    <button className={`${styles.resumoCard} ${filtro === 'ativas' ? styles.resumoAtivo : ''}`} onClick={() => setFiltro('ativas')}>
                        <span className={`${styles.resumoIcone} ${styles.resumoVerde}`}>
                            <FaCheckCircle />
                        </span>
                        <div>
                            <strong>{totalAtivas}</strong>
                            <span>Saudáveis</span>
                        </div>
                    </button>
                    <button className={`${styles.resumoCard} ${filtro === 'inativas' ? styles.resumoAtivo : ''}`} onClick={() => setFiltro('inativas')}>
                        <span className={`${styles.resumoIcone} ${styles.resumoLaranja}`}>
                            <FaExclamationTriangle />
                        </span>
                        <div>
                            <strong>{totalInativas}</strong>
                            <span>Inativas</span>
                        </div>
                    </button>
                </div>

                {/* Grade de Cards */}
                {carregando ? (
                    <div className={styles.loading}>
                        <Spinner animation="border" style={{ color: '#fbbc05' }} />
                    </div>
                ) : colmeiasFiltradas.length === 0 ? (
                    <div className={styles.vazio}>
                        <FaTimes className={styles.vazioIcone} />
                        <p>Nenhuma colmeia encontrada.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {colmeiasFiltradas.map(c => (
                            <ColmeiaCard
                                key={c.colmeiaID}
                                identificacao={c.identificacao}
                                tipoAbelha={c.tipoAbelha}
                                ativa={c.ativa}
                                apiarioNome={getNomeApiario(c.apiarioID)}
                                quantidadeQuadros={c.quantidadeQuadros}
                                quantidadeMelgueiras={c.quantidadeMelgueiras}
                                onEdit={() => abrirEditar(c)}
                                onDelete={() => { setColmeiaSelecionada(c); setMostrarModalDel(true); }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Exclusão */}
            <Modal show={mostrarModalDel} onHide={() => setMostrarModalDel(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '15px' }}>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: '14px' }}>
                    Tem certeza que deseja excluir <strong>{colmeiaSelecionada?.identificacao}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setMostrarModalDel(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmarExclusao}>Excluir</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Formulário */}
            <Modal show={mostrarModalForm} onHide={() => setMostrarModalForm(false)} centered>
                <Form onSubmit={salvar}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontSize: '15px' }}>
                            {modoEdicao ? 'Editar Colmeia' : 'Nova Colmeia'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.formLabel}>Identificação</Form.Label>
                            <Form.Control size="sm" type="text" name="identificacao" value={formData.identificacao} onChange={handleChange} required placeholder="Ex: COL-001" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.formLabel}>Tipo de Abelha</Form.Label>
                            <Form.Control size="sm" type="text" name="tipoAbelha" value={formData.tipoAbelha} onChange={handleChange} placeholder="Ex: Apis mellifera" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.formLabel}>Apiário</Form.Label>
                            <Form.Select size="sm" name="apiarioID" value={formData.apiarioID} onChange={handleChange} required>
                                <option value="">Selecione...</option>
                                {apiarios.map(a => <option key={a.apiarioID} value={a.apiarioID}>{a.nome}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Check type="switch" id="ativa-switch" label="Colmeia Ativa" name="ativa" checked={formData.ativa} onChange={handleChange} />
                        <div className="row mt-3">
                            <div className="col-6">
                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>Qtd. Quadros</Form.Label>
                                    <Form.Control size="sm" type="number" name="quantidadeQuadros" value={formData.quantidadeQuadros} onChange={handleChange} min="0" />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group>
                                    <Form.Label className={styles.formLabel}>Qtd. Melgueiras</Form.Label>
                                    <Form.Control size="sm" type="number" name="quantidadeMelgueiras" value={formData.quantidadeMelgueiras} onChange={handleChange} min="0" />
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setMostrarModalForm(false)}>Cancelar</Button>
                        <Button style={{ background: '#fbbc05', border: 'none', color: '#1a1a2e', fontWeight: 600 }} type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Topbar>
    );
};

export default Colmeias;
