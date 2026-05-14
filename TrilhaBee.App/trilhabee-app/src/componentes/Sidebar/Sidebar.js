import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaForumbee, FaLayerGroup, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = ({ children }) => {
    const location = useLocation();

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <FaForumbee className={styles.brandIcon} />
                    <h2>TrilhaBee</h2>
                </div>
                
                <nav className={styles.navMenu}>
                    <Link to="/" className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}>
                        <FaHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>
                    <Link to="/apiarios" className={`${styles.navItem} ${location.pathname.startsWith('/apiarios') ? styles.active : ''}`}>
                        <FaLayerGroup className={styles.navIcon} />
                        <span>Apiários</span>
                    </Link>
                    <Link to="/colmeias" className={`${styles.navItem} ${location.pathname.startsWith('/colmeias') ? styles.active : ''}`}>
                        <FaForumbee className={styles.navIcon} />
                        <span>Colmeias</span>
                    </Link>
                    <Link to="/inspecoes" className={`${styles.navItem} ${location.pathname.startsWith('/inspecoes') ? styles.active : ''}`}>
                        <FaClipboardList className={styles.navIcon} />
                        <span>Inspeções</span>
                    </Link>
                    <Link to="/alertas" className={`${styles.navItem} ${location.pathname.startsWith('/alertas') ? styles.active : ''}`}>
                        <FaExclamationTriangle className={styles.navIcon} />
                        <span>Alertas IA</span>
                    </Link>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Sidebar;
