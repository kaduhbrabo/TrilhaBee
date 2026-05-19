import React from 'react';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaForumbee } from 'react-icons/fa';
import styles from './ColmeiaCard.module.css';

const ColmeiaCard = ({ identificacao, tipoAbelha, ativa, apiarioNome, condicao, quantidadeQuadros, quantidadeMelgueiras, onEdit, onDelete }) => {
    // Determina o nível de saúde
    const nivelSaude = () => {
        if (!ativa) return 'inativa';
        if (condicao === 'Ruim') return 'critico';
        if (condicao === 'Regular') return 'atencao';
        return 'saudavel';
    };

    const labelSaude = () => {
        const nivel = nivelSaude();
        if (nivel === 'inativa')  return 'Inativa';
        if (nivel === 'critico')  return 'Crítica';
        if (nivel === 'atencao')  return 'Atenção';
        return 'Saudável';
    };

    const nivel = nivelSaude();
    const producao = (quantidadeMelgueiras || 0) * 12.5;

    return (
        <div className={`${styles.card} ${styles[nivel]}`}>
            {/* Tag flutuante de status */}
            <div className={styles.statusRow}>
                <span className={`${styles.badge} ${styles['badge_' + nivel]}`}>
                    {labelSaude()}
                </span>
            </div>

            <div className={styles.corpo}>
                <div className={styles.iconWrap}>
                    <FaForumbee className={styles.iconeColmeia} />
                </div>
                <div className={styles.info}>
                    <strong className={styles.nome}>{identificacao}</strong>
                    <span className={styles.tipo}>{tipoAbelha || 'Sem espécie definida'}</span>
                </div>
            </div>

            <div className={styles.dadosWrap}>
                <div className={styles.dadoItem}>
                    <span className={styles.dadoLabel}>Quadros:</span>
                    <strong className={styles.dadoValor}>{quantidadeQuadros || 0}</strong>
                </div>
                <div className={styles.dadoItem}>
                    <span className={styles.dadoLabel}>Melgueiras:</span>
                    <strong className={styles.dadoValor}>{quantidadeMelgueiras || 0}</strong>
                </div>
                <div className={styles.dadoItem}>
                    <span className={styles.dadoLabel}>Produção:</span>
                    <strong className={styles.dadoValorHighlight}>{producao} kg</strong>
                </div>
            </div>

            <div className={styles.rodape}>
                <div className={styles.localizacao}>
                    <FaMapMarkerAlt className={styles.pinIcon} />
                    <span>{apiarioNome || 'Sem apiário'}</span>
                </div>
                
                <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={onEdit} title="Editar">
                        <FaEdit />
                    </button>
                    <button className={styles.btnExcluir} onClick={onDelete} title="Excluir">
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColmeiaCard;
