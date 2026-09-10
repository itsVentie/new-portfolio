import styles from '../../styles/About/LanguagesCard.module.css';

export function LanguagesCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Languages</h3>

      <div className={styles.langGrid}>
        <span className={styles.langBadge}>🇬🇧 English</span>
        <span className={styles.langBadge}>🇷🇺 Russian</span>
        <span className={styles.langBadge}>🇩🇪 German</span>
        <span className={styles.langBadge}>🇫🇷 French</span>
        <span className={styles.langBadge}>🇪🇸 Spanish</span>
      </div>
    </div>
  );
}