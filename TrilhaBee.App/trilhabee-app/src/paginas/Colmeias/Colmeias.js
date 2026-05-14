import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { FaPlus, FaFilter } from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import ColmeiaCard from '../../componentes/ColmeiaCard/ColmeiaCard';
import { colmeiaAPI } from '../../services/colmeiaAPI';
import { apiarioAPI } from '../../services/apiarioAPI';
import styles from './Colmeias.module.css';

const Colmeias = () => {
    const [colmeias, setColmeias] = useState([]);
    const [apiarios, setApiarios] = useState([]); // Para o select do formulário
    const [carregando, setCarregando] = useState(true);
    
    // Estados do Modal de Exclusão
    const [mostrarModalDel, setMostrarModalDel] = useState(false);
    const [colmeiaSelecionada, setColmeiaSelecionada] = useState(null);

    // Estados do Modal de Formulário (Criar/Editar)
    const [mostrarModalForm, setMostrarModalForm] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState({
        identificacao: '',
        tipoAbelha: '',
        ativa: true,
        apiarioID: ''
    });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

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
            console.error("Falha ao carregar colmeias", erro);
        } finally {
            setCarregando(false);
        }
    };

    // --- FUNÇÕES DE EXCLUSÃO ---
    const abrirModalExclusao = (colmeia) => {
        setColmeiaSelecionada(colmeia);
        setMostrarModalDel(true);
    };

    const fecharModalDel = () => {
        setMostrarModalDel(false);
        setColmeiaSelecionada(null);
    };

    const confirmarExclusao = async () => {
        if (!colmeiaSelecionada) return;
        try {
            await colmeiaAPI.deletarAsync(colmeiaSelecionada.colmeiaID);
            setColmeias(colmeias.filter(c => c.colmeiaID !== colmeiaSelecionada.colmeiaID));
            fecharModalDel();
        } catch (erro) {
            alert("Não foi possível excluir a colmeia.");
        }
    };

    // --- FUNÇÕES DE FORMULÁRIO (CRIAR/EDITAR) ---
    const abrirModalNovo = () => {
        setModoEdicao(false);
        setFormData({ identificacao: '', tipoAbelha: '', ativa: true, apiarioID: '' });
        setMostrarModalForm(true);
    };

    const abrirModalEditar = (colmeia) => {
        setModoEdicao(true);
        setColmeiaSelecionada(colmeia);
        setFormData({
            identificacao: colmeia.identificacao,
            tipoAbelha: colmeia.tipoAbelha,
            ativa: colmeia.ativa,
            apiarioID: colmeia.apiarioID || ''
        });
        setMostrarModalForm(true);
    };

    const fecharModalForm = () => {
        setMostrarModalForm(false);
        setColmeiaSelecionada(null);
    };

    const handleFormChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    const salvarColmeia = async (e) => {
        e.preventDefault();
        setSalvando(true);

        try {
            const payload = {
                ...formData,
                apiarioID: parseInt(formData.apiarioID)
            };

            if (modoEdicao) {
                await colmeiaAPI.atualizarAsync(colmeiaSelecionada.colmeiaID, payload);
            } else {
                await colmeiaAPI.criarAsync(payload);
            }
            
            fecharModalForm();
            carregarDados(); // Recarrega a lista
        } catch (erro) {
            alert("Erro ao salvar colmeia. Verifique os dados.");
        } finally {
            setSalvando(false);
        }
    };

    // Helper para achar o nome do apiário
    const getNomeApiario = (apiarioId) => {
        const apiario = apiarios.find(a => a.apiarioID === apiarioId);
        return apiario ? apiario.nome : 'Sem apiário';
    };

    return (
        <Topbar>
            <div className={styles.paginaConteudo}>
                <div className={styles.cabecalhoPagina}>
                    <h2>Colmeias</h2>
                    <div className={styles.acoesHeader}>
                        <Button variant="outline-secondary" className="me-2">
                            <FaFilter className="me-2" /> Filtrar
                        </Button>
                        <Button variant="warning" onClick={abrirModalNovo}>
                            <FaPlus className="me-2" /> Nova Colmeia
                        </Button>
                    </div>
                </div>

                {carregando ? (
                    <div className="text-center p-5">
                        <Spinner animation="border" variant="warning" />
                        <p className="mt-3 text-muted">Carregando colmeias...</p>
                    </div>
                ) : colmeias.length === 0 ? (
                    <div className="text-center p-5 text-muted">
                        Nenhuma colmeia encontrada.
                    </div>
                ) : (
                    <div className={styles.gridColmeias}>
                        {colmeias.map(colmeia => (
                            <ColmeiaCard 
                                key={colmeia.colmeiaID}
                                identificacao={colmeia.identificacao}
                                ativa={colmeia.ativa}
                                apiarioNome={getNomeApiario(colmeia.apiarioID)}
                                onEdit={() => abrirModalEditar(colmeia)}
                                onDelete={() => abrirModalExclusao(colmeia)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Confirmação Exclusão */}
            <Modal show={mostrarModalDel} onHide={fecharModalDel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja excluir a colmeia <strong>{colmeiaSelecionada?.identificacao}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={fecharModalDel}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmarExclusao}>Sim, excluir</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Formulário */}
            <Modal show={mostrarModalForm} onHide={fecharModalForm} centered size="lg">
                <Form onSubmit={salvarColmeia}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modoEdicao ? 'Editar Colmeia' : 'Nova Colmeia'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Identificação (Nome/Código)</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="identificacao"
                                value={formData.identificacao}
                                onChange={handleFormChange}
                                required 
                                placeholder="Ex: COL-01"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Abelha</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="tipoAbelha"
                                value={formData.tipoAbelha}
                                onChange={handleFormChange}
                                required 
                                placeholder="Ex: Apis mellifera (Europeia)"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apiário</Form.Label>
                            <Form.Select 
                                name="apiarioID" 
                                value={formData.apiarioID} 
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">Selecione um apiário...</option>
                                {apiarios.map(a => (
                                    <option key={a.apiarioID} value={a.apiarioID}>
                                        {a.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check 
                                type="switch"
                                id="ativa-switch"
                                label="Colmeia Ativa?"
                                name="ativa"
                                checked={formData.ativa}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={fecharModalForm}>Cancelar</Button>
                        <Button variant="warning" type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar Colmeia'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Topbar>
    );
};

export default Colmeias;
