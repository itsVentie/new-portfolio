import { useState } from 'preact/hooks';
import styles from '../../styles/components/ProfileHeader.module.css';

export function ProfileHeader() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
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
        
        <div className={styles.info}>
          <h1 className={styles.name}>Systems Security Engineer</h1>
          <p className={styles.role}>Implementing robust security measures for modern applications</p>
          
          <div className={styles.stackList}>
            <span className={styles.stackItem}>Rust</span>
            <span className={styles.stackItem}>Golang</span>
            <span className={styles.stackItem}>C++</span>
            <span className={styles.stackItem}>Python</span>
          </div>
        </div>
      </div>
    </div>
  );
}