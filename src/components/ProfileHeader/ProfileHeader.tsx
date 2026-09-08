import { useState } from 'preact/hooks';
import styles from '../../styles/components/ProfileHeader.module.css';

export function ProfileHeader() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.leftColumn}>
          <div className={styles.avatarWrapper}>
            {!hasError ? (
              <img 
                src="https://unavatar.io/telegram/ventie" 
                alt="ventie avatar"
                className={styles.avatarImg}
                onError={() => setHasError(true)}
              />
            ) : (
              <div className={styles.avatarFallback}>V</div>
            )}
          </div>

          <div className={styles.titleBox}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>Systems Security Engineer</h1>
              <span className={styles.username}>@Ventie</span>
            </div>
            <p className={styles.role}>Implementing robust security measures for modern applications</p>
          </div>
        </div>

        <div className={styles.boxesGroup}>
          <div className={styles.box}>
            <span className={`${styles.boxBadge} ${styles.badgeLavender}`}>Technologies</span>
            <div className={styles.stackList}>
              <span className={styles.stackItem}>Rust</span>
              <span className={styles.stackItem}>Go</span>
              <span className={styles.stackItem}>C++</span>
              <span className={styles.stackItem}>Python</span>
            </div>
          </div>

          <div className={styles.box}>
            <span className={`${styles.boxBadge} ${styles.badgeSky}`}>Links</span>
            <div className={styles.socials}>
              <a href="https://t.me/ventie" target="_blank" rel="noreferrer" className={styles.socialLink}>
                Telegram
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}