import styles from '../../styles/Home/Home.module.css';

export function GithubActivity() {
  return (
    <section className={`${styles.card} ${styles.spanTwo}`}>
      <div className={styles.githubBox}>
        <div className={styles.ghText}>
          <h2 className={styles.cardTitle}>Open Source & Activity</h2>
          <p className={styles.cardText}>
            Consistently committing code, maintaining security tools, and experimenting with system architectures.
          </p>
        </div>
        <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.githubBtn}>
          View Profile @Ventie
        </a>
      </div>
    </section>
  );
}