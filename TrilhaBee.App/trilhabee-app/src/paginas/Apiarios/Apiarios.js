import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spinner } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import Sidebar from '../../componentes/Sidebar/Sidebar';
import Topbar from '../../componentes/Topbar/Topbar';
import { apiarioAPI } from '../../services/apiarioAPI';
import styles from './Apiarios.module.css';

const Apiarios = () => {
    const [apiarios, setApiarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    
    // Estados do Modal de Exclusão
    const [mostrarModal, setMostrarModal] = useState(false);
    const [apiarioSelecionado, setApiarioSelecionado] = useState(null);

    useEffect(() => {
        carregarApiarios();
    }, []);

    const carregarApiarios = async () => {
        try {
            setCarregando(true);
            const dados = await apiarioAPI.listarAsync();
            setApiarios(dados);
        } catch (erro) {
            // Se der erro 401, é porque falta autenticação!
            console.error("Falha ao carregar apiários", erro);
        } finally {
            setCarregando(false);
        }
    };

    const abrirModalExclusao = (apiario) => {
        setApiarioSelecionado(apiario);
        setMostrarModal(true);
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setApiarioSelecionado(null);
    };

    const confirmarExclusao = async () => {
        if (!apiarioSelecionado) return;
        
        try {
            await apiarioAPI.deletarAsync(apiarioSelecionado.apiarioID);
            // Atualiza a lista após excluir
            setApiarios(apiarios.filter(a => a.apiarioID !== apiarioSelecionado.apiarioID));
            fecharModal();
        } catch (erro) {
            console.error("Falha ao excluir apiário", erro);
            alert("Não foi possível excluir o apiário.");
        }
    };

    return (
        <Sidebar>
            <Topbar titulo="Gerenciar Apiários">
                <div className={styles.paginaConteudo}>
                    <div className={styles.cabecalhoPagina}>
                        <h2>Seus Apiários</h2>
                        <Button variant="warning" className={styles.btnNovo}>
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
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiarios.map((apiario) => (
                                        <tr key={apiario.apiarioID}>
                                            <td>#{apiario.apiarioID}</td>
                                            <td className="fw-bold">{apiario.nome}</td>
                                            <td>{apiario.localizacao}</td>
                                            <td className="text-center">
                                                <Button variant="light" size="sm" className="me-2 text-primary" title="Editar">
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
            </Topbar>

            {/* Modal de Confirmação de Exclusão */}
            <Modal show={mostrarModal} onHide={fecharModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja excluir o apiário <strong>{apiarioSelecionado?.nome}</strong>?<br/>
                    Esta ação não pode ser desfeita.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={fecharModal}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmarExclusao}>
                        Sim, excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Sidebar>
    );
};

export default Apiarios;
