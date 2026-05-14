import React, { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaForumbee, FaLayerGroup, FaClipboardList, FaExclamationTriangle, FaBars, FaSignOutAlt } from 'react-icons/fa';
import styles from './Topbar.module.css';

const Topbar = ({ children }) => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const navigate = useNavigate();
    
    // Pega o nome do usuário salvo no localStorage (se existir)
    const usuarioNome = localStorage.getItem('usuarioNome') || 'Apicultor';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioNome');
        navigate('/login');
    };

    return (
        <div className={styles.layout}>
            <Navbar expand={false} className={styles.navbar} fixed="top">
                <Container fluid className="px-4">
                    <div className="d-flex align-items-center">
                        <Navbar.Toggle 
                            aria-controls="offcanvasNavbar" 
                            className={styles.menuToggle}
                            onClick={() => setMostrarMenu(true)}
                        >
                            <FaBars />
                        </Navbar.Toggle>
                        <Navbar.Brand as={Link} to="/apiarios" className={styles.brand}>
                            <FaForumbee className={styles.brandIcon} />
                            TrilhaBee
                        </Navbar.Brand>
                    </div>

                    <div className={styles.acoes}>
                        <button className={styles.iconButton} title="Notificações">
                            <FaBell />
                        </button>
                        <div className={styles.perfil}>
                            <FaUserCircle className={styles.perfilIcon} />
                            <span className={styles.perfilNome}>{usuarioNome}</span>
                            <button className={styles.btnSair} onClick={handleLogout} title="Sair">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </div>

                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start"
                        show={mostrarMenu}
                        onHide={() => setMostrarMenu(false)}
                        className={styles.offcanvas}
                    >
                        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
                            <Offcanvas.Title id="offcanvasNavbarLabel" className={styles.offcanvasTitle}>
                                <FaForumbee className="me-2" /> Menu TrilhaBee
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className={styles.offcanvasBody}>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link as={Link} to="/apiarios" onClick={() => setMostrarMenu(false)} className={styles.navLink}>
                                    <FaLayerGroup className={styles.navIcon} /> Apiários
                                </Nav.Link>
                                <Nav.Link as={Link} to="/colmeias" onClick={() => setMostrarMenu(false)} className={styles.navLink}>
                                    <FaForumbee className={styles.navIcon} /> Colmeias
                                </Nav.Link>
                                <Nav.Link as={Link} to="/inspecoes" onClick={() => setMostrarMenu(false)} className={styles.navLink}>
                                    <FaClipboardList className={styles.navIcon} /> Inspeções
                                </Nav.Link>
                                <Nav.Link as={Link} to="/alertas" onClick={() => setMostrarMenu(false)} className={styles.navLink}>
                                    <FaExclamationTriangle className={styles.navIcon} /> Alertas IA
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Topbar;
