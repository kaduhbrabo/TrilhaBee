import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spinner, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus, FaClipboardCheck, FaCheck, FaTimes } from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import { inspecaoAPI } from '../../services/inspecaoAPI';
import { colmeiaAPI } from '../../services/colmeiaAPI';
import styles from './Inspecoes.module.css';

const Inspecoes = () => {
    const [inspecoes, setInspecoes] = useState([]);
    const [colmeias, setColmeias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    
    // Estados Modal Exclusão
    const [mostrarModalDel, setMostrarModalDel] = useState(false);
    const [inspecaoSelecionada, setInspecaoSelecionada] = useState(null);

    // Estados Modal Formulário
    const [mostrarModalForm, setMostrarModalForm] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState({
        colmeiaID: '',
        dataInspecao: '',
        clima: '',
        temperamento: '',
        forcaColmeia: 5,
        nivelAlimento: 5,
        temRainha: true,
        temPostura: true,
        condicaoGeral: '',
        melColetadoKg: '',
        dataColheita: '',
        observacoes: ''
    });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [dadosInspec, dadosColm] = await Promise.all([
                inspecaoAPI.listarAsync(),
                colmeiaAPI.listarAsync()
            ]);
            setInspecoes(dadosInspec);
            setColmeias(dadosColm);
        } catch (erro) {
            console.error("Falha ao carregar inspeções", erro);
        } finally {
            setCarregando(false);
        }
    };

    // Helper Nome Colmeia
    const getNomeColmeia = (id) => {
        const colm = colmeias.find(c => c.colmeiaID === id);
        return colm ? colm.identificacao : `ID: ${id}`;
    };

    // --- FUNÇÕES DE EXCLUSÃO ---
    const abrirModalExclusao = (inspecao) => {
        setInspecaoSelecionada(inspecao);
        setMostrarModalDel(true);
    };

    const fecharModalDel = () => {
        setMostrarModalDel(false);
        setInspecaoSelecionada(null);
    };

    const confirmarExclusao = async () => {
        if (!inspecaoSelecionada) return;
        try {
            await inspecaoAPI.deletarAsync(inspecaoSelecionada.inspecaoID);
            setInspecoes(inspecoes.filter(i => i.inspecaoID !== inspecaoSelecionada.inspecaoID));
            fecharModalDel();
        } catch (erro) {
            alert("Não foi possível excluir a inspeção.");
        }
    };

    // --- FUNÇÕES DE FORMULÁRIO ---
    const abrirModalNovo = () => {
        setModoEdicao(false);
        setFormData({
            colmeiaID: '',
            dataInspecao: new Date().toISOString().split('T')[0],
            clima: 'Ensolarado',
            temperamento: 'Calmas',
            forcaColmeia: 5,
            nivelAlimento: 5,
            temRainha: true,
            temPostura: true,
            condicaoGeral: 'Boa',
            melColetadoKg: '',
            dataColheita: '',
            observacoes: ''
        });
        setMostrarModalForm(true);
    };

    const abrirModalEditar = (inspecao) => {
        setModoEdicao(true);
        setInspecaoSelecionada(inspecao);
        setFormData({
            colmeiaID: inspecao.colmeiaID,
            dataInspecao: inspecao.dataInspecao.split('T')[0],
            clima: inspecao.clima,
            temperamento: inspecao.temperamento,
            forcaColmeia: inspecao.forcaColmeia,
            nivelAlimento: inspecao.nivelAlimento,
            temRainha: inspecao.temRainha,
            temPostura: inspecao.temPostura,
            condicaoGeral: inspecao.condicaoGeral,
            melColetadoKg: inspecao.melColetadoKg || '',
            dataColheita: inspecao.dataColheita ? inspecao.dataColheita.split('T')[0] : '',
            observacoes: inspecao.observacoes || ''
        });
        setMostrarModalForm(true);
    };

    const fecharModalForm = () => {
        setMostrarModalForm(false);
        setInspecaoSelecionada(null);
    };

    const handleFormChange = (e) => {
        const { name, type, checked, value } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const salvarInspecao = async (e) => {
        e.preventDefault();
        setSalvando(true);

        try {
            let obsFinal = formData.observacoes;
            if (formData.melColetadoKg && formData.dataColheita) {
                const melInfo = `[Colheita: ${formData.melColetadoKg}kg em ${new Date(formData.dataColheita).toLocaleDateString('pt-BR')}]`;
                obsFinal = obsFinal ? `${melInfo} - ${obsFinal}` : melInfo;
            }

            const payload = {
                ...formData,
                observacoes: obsFinal,
                colmeiaID: parseInt(formData.colmeiaID),
                forcaColmeia: parseInt(formData.forcaColmeia),
                nivelAlimento: parseInt(formData.nivelAlimento)
            };

            if (modoEdicao) {
                await inspecaoAPI.atualizarAsync(inspecaoSelecionada.inspecaoID, payload);
            } else {
                await inspecaoAPI.criarAsync(payload);
            }
            
            fecharModalForm();
            carregarDados();
        } catch (erro) {
            alert("Erro ao salvar inspeção.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Topbar>
            <div className={styles.paginaConteudo}>
                <div className={styles.cabecalhoPagina}>
                    <h2><FaClipboardCheck className="me-2 text-warning" /> Diário de Inspeções</h2>
                    <Button variant="warning" className={styles.btnNovo} onClick={abrirModalNovo}>
                        <FaPlus className="me-2" /> Nova Inspeção
                    </Button>
                </div>

                <div className={styles.tabelaContainer}>
                    {carregando ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="warning" />
                        </div>
                    ) : inspecoes.length === 0 ? (
                        <div className="text-center p-5 text-muted">
                            Nenhuma inspeção registrada.
                        </div>
                    ) : (
                        <Table responsive hover className="align-middle" style={{ fontSize: '13px' }}>
                            <thead className={styles.tabelaHeader}>
                                <tr>
                                    <th>Data</th>
                                    <th>Colmeia</th>
                                    <th>Condição</th>
                                    <th>Alimento</th>
                                    <th>Rainha / Postura</th>
                                    <th>Mel (kg)</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inspecoes.map(inspec => (
                                    <tr key={inspec.inspecaoID}>
                                        <td style={{ fontWeight: 600 }}>{new Date(inspec.dataInspecao).toLocaleDateString('pt-BR')}</td>
                                        <td>{getNomeColmeia(inspec.colmeiaID)}</td>
                                        <td>
                                            <span className={`badge ${inspec.condicaoGeral === 'Ruim' ? 'bg-danger' : inspec.condicaoGeral === 'Regular' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                {inspec.condicaoGeral}
                                            </span>
                                        </td>
                                        <td>Nível {inspec.nivelAlimento}/10</td>
                                        <td>
                                            {inspec.temRainha
                                                ? <FaCheck style={{ color: '#22c55e' }} />
                                                : <FaTimes style={{ color: '#ef4444' }} />}
                                            {' / '}
                                            {inspec.temPostura
                                                ? <FaCheck style={{ color: '#22c55e' }} />
                                                : <FaTimes style={{ color: '#ef4444' }} />}
                                        </td>
                                        <td style={{ color: '#d97706', fontWeight: 600 }}>
                                            {inspec.melColetadoKg ? `${inspec.melColetadoKg} kg` : <span style={{ color: '#d1cec7' }}>—</span>}
                                        </td>
                                        <td className="text-center">
                                            <Button variant="light" size="sm" className="me-1 text-primary" onClick={() => abrirModalEditar(inspec)}><FaEdit /></Button>
                                            <Button variant="light" size="sm" className="text-danger" onClick={() => abrirModalExclusao(inspec)}><FaTrash /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Modal Formulário */}
            <Modal show={mostrarModalForm} onHide={fecharModalForm} centered size="lg">
                <Form onSubmit={salvarInspecao}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modoEdicao ? 'Editar Inspeção' : 'Nova Inspeção'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Colmeia</Form.Label>
                                <Form.Select name="colmeiaID" value={formData.colmeiaID} onChange={handleFormChange} required>
                                    <option value="">Selecione...</option>
                                    {colmeias.map(c => <option key={c.colmeiaID} value={c.colmeiaID}>{c.identificacao}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Data</Form.Label>
                                <Form.Control type="date" name="dataInspecao" value={formData.dataInspecao} onChange={handleFormChange} required />
                            </Form.Group>
                        </div>
                        
                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Clima</Form.Label>
                                <Form.Select name="clima" value={formData.clima} onChange={handleFormChange}>
                                    <option>Ensolarado</option>
                                    <option>Nublado</option>
                                    <option>Chuvoso</option>
                                    <option>Frio</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Condição Geral</Form.Label>
                                <Form.Select name="condicaoGeral" value={formData.condicaoGeral} onChange={handleFormChange}>
                                    <option>Excelente</option>
                                    <option>Boa</option>
                                    <option>Regular</option>
                                    <option>Ruim</option>
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Força da Colmeia (1 a 10)</Form.Label>
                                <Form.Control type="number" min="1" max="10" name="forcaColmeia" value={formData.forcaColmeia} onChange={handleFormChange} required />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Nível de Alimento (1 a 10)</Form.Label>
                                <Form.Control type="number" min="1" max="10" name="nivelAlimento" value={formData.nivelAlimento} onChange={handleFormChange} required />
                            </Form.Group>
                        </div>

                        <div className="row mb-3">
                            <Form.Group className="col-md-6">
                                <Form.Check type="switch" label="Possui Rainha?" name="temRainha" checked={formData.temRainha} onChange={handleFormChange} />
                            </Form.Group>
                            <Form.Group className="col-md-6">
                                <Form.Check type="switch" label="Possui Postura (Ovos/Crias)?" name="temPostura" checked={formData.temPostura} onChange={handleFormChange} />
                            </Form.Group>
                        </div>

                        {/* Seção: Colheita de Mel */}
                        <hr style={{ borderColor: '#f5f3ee', margin: '8px 0 16px' }} />
                        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8a8fa8', marginBottom: '12px' }}>Colheita de Mel</p>
                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label style={{ fontSize: '12px', fontWeight: 600, color: '#3d3d3d' }}>Mel Coletado (kg)</Form.Label>
                                <Form.Control size="sm" type="number" step="0.1" min="0" name="melColetadoKg" value={formData.melColetadoKg} onChange={handleFormChange} placeholder="Ex: 3.5" />
                            </Form.Group>
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label style={{ fontSize: '12px', fontWeight: 600, color: '#3d3d3d' }}>Data da Colheita</Form.Label>
                                <Form.Control size="sm" type="date" name="dataColheita" value={formData.dataColheita} onChange={handleFormChange} />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontSize: '12px', fontWeight: 600, color: '#3d3d3d' }}>Observações Livres</Form.Label>
                            <Form.Control as="textarea" rows={2} name="observacoes" value={formData.observacoes} onChange={handleFormChange} style={{ fontSize: '13px' }} />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={fecharModalForm}>Cancelar</Button>
                        <Button variant="warning" type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Exclusão */}
            <Modal show={mostrarModalDel} onHide={fecharModalDel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja mesmo excluir esta inspeção?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={fecharModalDel}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmarExclusao}>Sim, excluir</Button>
                </Modal.Footer>
            </Modal>

        </Topbar>
    );
};

export default Inspecoes;
