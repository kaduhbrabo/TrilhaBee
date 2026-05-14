import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaUserCircle, FaBell, FaForumbee, FaLayerGroup,
    FaClipboardList, FaExclamationTriangle, FaBars,
    FaSignOutAlt, FaHome, FaUser, FaArchive
} from 'react-icons/fa';
import { alertaIaAPI } from '../../services/alertaIaAPI';
import styles from './Topbar.module.css';

const Topbar = ({ children }) => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [alertasPendentes, setAlertasPendentes] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const usuarioNome = localStorage.getItem('usuarioNome') || 'Apicultor';

    useEffect(() => {
        // Busca quantidade de alertas pendentes para o sino
        alertaIaAPI.listarAsync()
            .then(dados => {
                const pendentes = dados.filter(a => !a.resolvido).length;
                setAlertasPendentes(pendentes);
            })
            .catch(() => {}); // Silencia erro se não houver alertas ainda
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioNome');
        navigate('/login');
    };

    const fecharMenu = () => setMostrarMenu(false);

    const navLinks = [
        { to: '/inicio', icon: <FaHome />, label: 'Início' },
        { to: '/apiarios', icon: <FaLayerGroup />, label: 'Apiários' },
        { to: '/colmeias', icon: <FaArchive />, label: 'Colmeias' },
        { to: '/inspecoes', icon: <FaClipboardList />, label: 'Inspeções' },
        { to: '/alertas', icon: <FaExclamationTriangle />, label: 'Alertas IA' },
    ];

    return (
        <div className={styles.layout}>
            <Navbar expand={false} className={styles.navbar} fixed="top">
                <Container fluid className="px-3">
                    <div className="d-flex align-items-center">
                        <button
                            className={styles.menuToggle}
                            onClick={() => setMostrarMenu(true)}
                            title="Abrir menu"
                        >
                            <FaBars />
                        </button>
                        <Navbar.Brand as={Link} to="/inicio" className={styles.brand}>
                            <FaForumbee className={styles.brandIcon} />
                            TrilhaBee
                        </Navbar.Brand>
                    </div>

                    <div className={styles.acoes}>
                        {/* Sino com badge pulsante se houver alertas */}
                        <div className={styles.sinoWrapper}>
                            <button
                                className={styles.iconButton}
                                title="Alertas"
                                onClick={() => navigate('/alertas')}
                            >
                                <FaBell />
                            </button>
                            {alertasPendentes > 0 && <span className={styles.badgeSino} />}
                        </div>

                        <div className={styles.perfil}>
                            <FaUserCircle className={styles.perfilIcon} />
                            <span className={styles.perfilNome}>{usuarioNome}</span>
                            <button className={styles.btnSair} onClick={handleLogout} title="Sair">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </div>

                    {/* Offcanvas Menu */}
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        placement="start"
                        show={mostrarMenu}
                        onHide={fecharMenu}
                        className={styles.offcanvas}
                    >
                        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
                            <Offcanvas.Title className={styles.offcanvasTitle}>
                                <FaForumbee /> TrilhaBee
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className={styles.offcanvasBody}>
                            <span className={styles.navSectionLabel}>Navegação</span>
                            <Nav className="flex-column">
                                {navLinks.map(link => (
                                    <Nav.Link
                                        key={link.to}
                                        as={Link}
                                        to={link.to}
                                        onClick={fecharMenu}
                                        className={styles.navLink}
                                    >
                                        <span className={styles.navIcon}>{link.icon}</span>
                                        {link.label}
                                    </Nav.Link>
                                ))}
                            </Nav>
                            <hr className={styles.navDivider} />
                            <span className={styles.navSectionLabel}>Conta</span>
                            <Nav className="flex-column">
                                <Nav.Link
                                    as={Link}
                                    to="/perfil"
                                    onClick={fecharMenu}
                                    className={styles.navLink}
                                >
                                    <span className={styles.navIcon}><FaUser /></span>
                                    Meu Perfil
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
