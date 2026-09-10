import styles from '../../styles/About/MindGamesCard.module.css';

export function MindGamesCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Mind Games</h3>

      <div className={styles.interestsList}>
        <div className={styles.interestRow}>
          <span className={styles.interestTitle}>Chess</span>
          <span className={styles.interestDetail}>2400-2500 Elo</span>
        </div>
        <div className={styles.interestRow}>
          <span className={styles.interestTitle}>Shogi</span>
          <span className={styles.interestDetail}>5 Kyu</span>
        </div>
      </div>
    </div>
  );
}