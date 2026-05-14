import React from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import styles from './Topbar.module.css';

const Topbar = ({ titulo, children }) => {
    return (
        <div className={styles.topbarContainer}>
            <header className={styles.header}>
                <div className={styles.tituloContainer}>
                    <h1 className={styles.titulo}>{titulo || "TrilhaBee"}</h1>
                </div>
                <div className={styles.acoes}>
                    <button className={styles.iconButton}>
                        <FaBell />
                    </button>
                    <div className={styles.perfil}>
                        <FaUserCircle className={styles.perfilIcon} />
                        <span className={styles.perfilNome}>Apicultor</span>
                    </div>
                </div>
            </header>
            <div className={styles.contentArea}>
                {children}
            </div>
        </div>
    );
};

export default Topbar;
