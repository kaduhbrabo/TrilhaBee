import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaUserCircle, FaBell, FaLayerGroup,
    FaClipboardList, FaExclamationTriangle, FaBars,
    FaSignOutAlt, FaHome, FaUser, FaArchive, FaMapMarkerAlt,
    FaSun, FaCloud, FaCloudRain, FaSnowflake, FaTint
} from 'react-icons/fa';
import { alertaIaAPI } from '../../services/alertaIaAPI';
import styles from './Topbar.module.css';

const Topbar = ({ children }) => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [alertasPendentes, setAlertasPendentes] = useState(0);
    const [climaGlobal, setClimaGlobal] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const OPENWEATHER_API_KEY = '4d311f9a29f0f074a07b79cc1248ccb5';

    const usuarioNome = localStorage.getItem('usuarioNome') || 'Apicultor';

    const getIconeClima = (mainInfo) => {
        if (!mainInfo) return <FaMapMarkerAlt className={styles.climaIcon} />;
        const mainLower = mainInfo.toLowerCase();
        if (mainLower.includes('clear')) return <FaSun className={styles.climaIcon} style={{color: '#fbbc05'}} />;
        if (mainLower.includes('cloud')) return <FaCloud className={styles.climaIcon} style={{color: '#8a8fa8'}} />;
        if (mainLower.includes('rain') || mainLower.includes('drizzle')) return <FaCloudRain className={styles.climaIcon} style={{color: '#3b82f6'}} />;
        if (mainLower.includes('snow')) return <FaSnowflake className={styles.climaIcon} style={{color: '#93c5fd'}} />;
        return <FaSun className={styles.climaIcon} style={{color: '#fbbc05'}} />;
    };

    useEffect(() => {
        // Busca quantidade de alertas pendentes para o sino
        alertaIaAPI.listarAsync()
            .then(dados => {
                const pendentes = dados.filter(a => !a.resolvido).length;
                setAlertasPendentes(pendentes);
            })
            .catch(() => {}); // Silencia erro se não houver alertas ainda

        // Lógica Global de Clima com Cache de 30 minutos
        const carregarClima = () => {
            const cache = sessionStorage.getItem('climaGlobalDataObj');
            if (cache) {
                const { dados, timestamp } = JSON.parse(cache);
                const agora = new Date().getTime();
                if (agora - timestamp < 30 * 60 * 1000) {
                    setClimaGlobal(dados);
                    return; // Usa o cache válido
                }
            }

            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&lang=pt_br&units=metric`);
                    const data = await res.json();
                    if(data.weather && data.weather.length > 0) {
                        const cidade = data.name;
                        const desc = data.weather[0].description;
                        const mainWeather = data.weather[0].main;
                        const temp = Math.round(data.main.temp);
                        const stringClima = `${cidade} - ${desc.charAt(0).toUpperCase() + desc.slice(1)}, ${temp}°C`;
                        
                        const dadosClima = { texto: stringClima, tipo: mainWeather };
                        setClimaGlobal(dadosClima);
                        sessionStorage.setItem('climaGlobalDataObj', JSON.stringify({
                            dados: dadosClima,
                            timestamp: new Date().getTime()
                        }));
                    }
                } catch(e) { }
            }, async () => {
                // Fallback: Se não tiver GPS, busca por Alfenas como padrão
                try {
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Alfenas,br&appid=${OPENWEATHER_API_KEY}&lang=pt_br&units=metric`);
                    const data = await res.json();
                    if(data.weather && data.weather.length > 0) {
                        const cidade = data.name;
                        const desc = data.weather[0].description;
                        const mainWeather = data.weather[0].main;
                        const temp = Math.round(data.main.temp);
                        const stringClima = `${cidade} - ${desc.charAt(0).toUpperCase() + desc.slice(1)}, ${temp}°C`;
                        
                        const dadosClima = { texto: stringClima, tipo: mainWeather };
                        setClimaGlobal(dadosClima);
                        sessionStorage.setItem('climaGlobalDataObj', JSON.stringify({
                            dados: dadosClima,
                            timestamp: new Date().getTime()
                        }));
                    }
                } catch(e) {}
            });
        };

        carregarClima();
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
        { to: '/colheita', icon: <FaTint />, label: 'Colheita' },
        { to: '/alertas', icon: <FaExclamationTriangle />, label: 'Recomendações' },
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
                            <img src="/logo.png" alt="TrilhaBee Logo" style={{ height: '54px', marginRight: '14px', objectFit: 'contain' }} />
                            TrilhaBee
                        </Navbar.Brand>
                    </div>

                    <div className={styles.acoes}>
                        {/* Clima Widget */}
                        {climaGlobal && (
                            <div className={styles.climaWidget} title="Clima Atual">
                                {getIconeClima(climaGlobal.tipo)}
                                <span className={styles.climaTexto}>{climaGlobal.texto}</span>
                            </div>
                        )}

                        {/* Sino com badge pulsante se houver alertas */}
                        <div className={styles.sinoWrapper}>
                            <button
                                className={styles.iconButton}
                                title="Recomendações de Manejo"
                                onClick={() => navigate('/alertas')}
                            >
                                <FaBell />
                            </button>
                            {alertasPendentes > 0 && <span className={styles.badgeSino} />}
                        </div>

                        <div className={styles.perfil} onClick={() => navigate('/perfil')} style={{ cursor: 'pointer' }} title="Ir para perfil">
                            <FaUserCircle className={styles.perfilIcon} />
                            <span className={styles.perfilNome}>{usuarioNome}</span>
                            <button className={styles.btnSair} onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Sair">
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
                        <Offcanvas.Header closeButton closeVariant="white" className={styles.offcanvasHeader}>
                            <Offcanvas.Title className={styles.offcanvasTitle}>
                                <img src="/logo.png" alt="TrilhaBee Logo" style={{ height: '48px', marginRight: '12px', objectFit: 'contain' }} /> TrilhaBee
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
