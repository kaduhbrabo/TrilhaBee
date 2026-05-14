import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spinner, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import Topbar from '../../componentes/Topbar/Topbar';
import { apiarioAPI } from '../../services/apiarioAPI';
import styles from './Apiarios.module.css';

const Apiarios = () => {
    const [apiarios, setApiarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    
    // Estados do Modal de Exclusão
    const [mostrarModalDel, setMostrarModalDel] = useState(false);
    const [apiarioSelecionado, setApiarioSelecionado] = useState(null);

    // Estados do Modal de Formulário (Criar/Editar)
    const [mostrarModalForm, setMostrarModalForm] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        localizacao: '',
        capacidade: 0
    });
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarApiarios();
    }, []);

    const carregarApiarios = async () => {
        try {
            setCarregando(true);
            const dados = await apiarioAPI.listarAsync();
            setApiarios(dados);
        } catch (erro) {
            console.error("Falha ao carregar apiários", erro);
        } finally {
            setCarregando(false);
        }
    };

    // --- FUNÇÕES DE EXCLUSÃO ---
    const abrirModalExclusao = (apiario) => {
        setApiarioSelecionado(apiario);
        setMostrarModalDel(true);
    };

    const fecharModalDel = () => {
        setMostrarModalDel(false);
        setApiarioSelecionado(null);
    };

    const confirmarExclusao = async () => {
        if (!apiarioSelecionado) return;
        try {
            await apiarioAPI.deletarAsync(apiarioSelecionado.apiarioID);
            setApiarios(apiarios.filter(a => a.apiarioID !== apiarioSelecionado.apiarioID));
            fecharModalDel();
        } catch (erro) {
            alert("Não foi possível excluir o apiário.");
        }
    };

    // --- FUNÇÕES DE FORMULÁRIO (CRIAR/EDITAR) ---
    const abrirModalNovo = () => {
        setModoEdicao(false);
        setFormData({ nome: '', localizacao: '', capacidade: 0 });
        setMostrarModalForm(true);
    };

    const abrirModalEditar = (apiario) => {
        setModoEdicao(true);
        setApiarioSelecionado(apiario);
        setFormData({
            nome: apiario.nome,
            localizacao: apiario.localizacao,
            capacidade: apiario.capacidade
        });
        setMostrarModalForm(true);
    };

    const fecharModalForm = () => {
        setMostrarModalForm(false);
        setApiarioSelecionado(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const salvarApiario = async (e) => {
        e.preventDefault();
        setSalvando(true);

        try {
            // Regra do Backend: Apiario precisa de um UsuarioID
            const payload = {
                ...formData,
                capacidade: parseInt(formData.capacidade),
                usuarioID: 1 // Chumbado provisoriamente
            };

            if (modoEdicao) {
                await apiarioAPI.atualizarAsync(apiarioSelecionado.apiarioID, payload);
            } else {
                await apiarioAPI.criarAsync(payload);
            }
            
            fecharModalForm();
            carregarApiarios(); // Recarrega a lista
        } catch (erro) {
            alert("Erro ao salvar apiário. Verifique os dados.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Topbar>
            <div className={styles.paginaConteudo}>
                <div className={styles.cabecalhoPagina}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', marginBottom: 2 }}>Meus Apiários</h2>
                        <p style={{ fontSize: '12px', color: '#8a8fa8', margin: 0 }}>Gerencie os locais de instalação das suas colmeias</p>
                    </div>
                    <Button className={styles.btnNovo} onClick={abrirModalNovo}>
                        <FaPlus className="me-2" />
                        Novo Apiário
                    </Button>
                </div>

                <div className={styles.tabelaContainer}>
                    {carregando ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="warning" />
                            <p className="mt-3 text-muted">Carregando seus apiários...</p>
                        </div>
                    ) : apiarios.length === 0 ? (
                        <div className="text-center p-5 text-muted">
                            Nenhum apiário encontrado. Cadastre o seu primeiro!
                        </div>
                    ) : (
                        <Table responsive hover className="align-middle">
                            <thead className={styles.tabelaHeader}>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Localização</th>
                                    <th>Capacidade (Colmeias)</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiarios.map((apiario) => (
                                    <tr key={apiario.apiarioID}>
                                        <td>#{apiario.apiarioID}</td>
                                        <td className="fw-bold">{apiario.nome}</td>
                                        <td>{apiario.localizacao}</td>
                                        <td>{apiario.totalColmeia || 0} / {apiario.capacidade}</td>
                                        <td className="text-center">
                                            <Button 
                                                variant="light" 
                                                size="sm" 
                                                className="me-2 text-primary" 
                                                title="Editar"
                                                onClick={() => abrirModalEditar(apiario)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="light" 
                                                size="sm" 
                                                className="text-danger" 
                                                title="Excluir"
                                                onClick={() => abrirModalExclusao(apiario)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação de Exclusão */}
            <Modal show={mostrarModalDel} onHide={fecharModalDel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja excluir o apiário <strong>{apiarioSelecionado?.nome}</strong>?<br/>
                    Esta ação não pode ser desfeita.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={fecharModalDel}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmarExclusao}>
                        Sim, excluir
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Formulário (Criar/Editar) */}
            <Modal show={mostrarModalForm} onHide={fecharModalForm} centered size="lg">
                <Form onSubmit={salvarApiario}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modoEdicao ? 'Editar Apiário' : 'Novo Apiário'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome do Apiário</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nome"
                                value={formData.nome}
                                onChange={handleFormChange}
                                required 
                                placeholder="Ex: Apiário Fazenda Sol"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Localização</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="localizacao"
                                value={formData.localizacao}
                                onChange={handleFormChange}
                                required 
                                placeholder="Ex: Setor Norte, perto do rio"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacidade Máxima de Colmeias</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="capacidade"
                                min="1"
                                value={formData.capacidade}
                                onChange={handleFormChange}
                                required 
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={fecharModalForm}>
                            Cancelar
                        </Button>
                        <Button variant="warning" type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar Apiário'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Topbar>
    );
};

export default Apiarios;
