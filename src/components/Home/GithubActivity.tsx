import styles from '../../styles/Home/Home.module.css';
import activityStyles from '../../styles/Home/GithubActivity.module.css';

const GITHUB_USERNAME = 'itsVentie';

export function GithubActivity() {
  return (
    <section className={`${styles.card} ${styles.spanTwo}`}>
      <div className={activityStyles.githubBox}>
        <div className={activityStyles.ghHeaderTop}>
          <h2 className={styles.cardTitle}>Activity & Stats</h2>
          <a 
            href={`https://github.com/${GITHUB_USERNAME}`} 
            target="_blank" 
            rel="noreferrer" 
            className={activityStyles.githubProfileLink}
          >
            @{GITHUB_USERNAME} ↗
          </a>
        </div>

        <div className={activityStyles.contribContainer} style={{ overflowX: 'auto', padding: '12px' }}>
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer" style={{ display: 'block', minWidth: '700px' }}>
            <img 
              src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`} 
              alt={`${GITHUB_USERNAME}'s Github contribution chart`}
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1)' }}
            />
          </a>
        </div>

      </div>
    </section>
  );
}