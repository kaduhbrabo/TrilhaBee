import React from 'react';
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './ColmeiaCard.module.css';

const ColmeiaCard = ({ identificacao, ativa, apiarioNome, onEdit, onDelete }) => {
    return (
        <div className={styles.cardHex}>
            <div className={styles.cardHeader}>
                <h3 className={styles.title}>{identificacao}</h3>
                <div className={styles.statusIcon}>
                    {ativa ? <FaCheckCircle className={styles.iconActive} /> : <FaTimesCircle className={styles.iconInactive} />}
                </div>
            </div>
            
            <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Status:</span>
                    <span className={ativa ? styles.textActive : styles.textInactive}>
                        {ativa ? 'Ativa' : 'Inativa'}
                    </span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Apiário:</span>
                    <span className={styles.textData}>{apiarioNome || 'Não atribuído'}</span>
                </div>
            </div>
            
            <div className={styles.cardFooter}>
                <button className={`${styles.btnAcao} ${styles.btnEdit}`} onClick={onEdit}>
                    <FaEdit /> Editar
                </button>
                <button className={`${styles.btnAcao} ${styles.btnDelete}`} onClick={onDelete}>
                    <FaTrash /> Excluir
                </button>
            </div>
        </div>
    );
};

export default ColmeiaCard;
