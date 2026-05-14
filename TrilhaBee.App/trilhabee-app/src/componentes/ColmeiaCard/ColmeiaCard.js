import React from 'react';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaForumbee } from 'react-icons/fa';
import styles from './ColmeiaCard.module.css';

const ColmeiaCard = ({ identificacao, tipoAbelha, ativa, apiarioNome, condicao, onEdit, onDelete }) => {
    // Determina o nível de saúde baseado na condição da última inspeção
    const nivelSaude = () => {
        if (!ativa) return 'inativa';
        if (condicao === 'Ruim') return 'critico';
        if (condicao === 'Regular') return 'atencao';
        return 'saudavel';
    };

    const labelSaude = () => {
        const nivel = nivelSaude();
        if (nivel === 'inativa')  return 'Inativa';
        if (nivel === 'critico')  return 'Crítico';
        if (nivel === 'atencao')  return 'Atenção';
        return 'Saudável';
    };

    const nivel = nivelSaude();

    return (
        <div className={`${styles.card} ${styles[nivel]}`}>
            {/* Indicador de saúde (borda superior colorida) já aplicado via CSS */}

            <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                    <FaForumbee className={styles.iconeColmeia} />
                </div>
                <div className={styles.info}>
                    <strong className={styles.nome}>{identificacao}</strong>
                    {tipoAbelha && (
                        <span className={styles.tipo}>{tipoAbelha}</span>
                    )}
                </div>
            </div>

            <div className={styles.statusWrap}>
                <span className={`${styles.badge} ${styles['badge_' + nivel]}`}>
                    {labelSaude()}
                </span>
            </div>

            {apiarioNome && (
                <div className={styles.localizacao}>
                    <FaMapMarkerAlt className={styles.pinIcon} />
                    <span>{apiarioNome}</span>
                </div>
            )}

            <div className={styles.acoes}>
                <button className={styles.btnEditar} onClick={onEdit} title="Editar">
                    <FaEdit />
                </button>
                <button className={styles.btnExcluir} onClick={onDelete} title="Excluir">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default ColmeiaCard;
