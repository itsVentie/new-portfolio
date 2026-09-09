import { useState } from 'preact/hooks';
import styles from '../../styles/components/ProfileHeader.module.css';

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.834 7.424l-2.02 9.518c-.15.676-.55.842-1.118.523l-3.08-2.27-1.486 1.432c-.164.164-.303.303-.62.303l.22-3.13 5.7-5.15c.248-.22-.054-.342-.386-.12l-7.045 4.436-3.04-.95c-.662-.207-.676-.662.14-.982l11.88-4.58c.55-.2 1.03.13.815.97z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

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
                alt="Ventie avatar"
                className={styles.avatarImg}
                onError={() => setHasError(true)}
              />
            ) : (
              <div className={styles.avatarFallback}>V</div>
            )}
          </div>

          <div className={styles.titleBox}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>Systems & Security Engineer</h1>
              <span className={styles.username}>
                <ShieldCheckIcon /> @Ventie
              </span>
            </div>
            <p className={styles.role}>
              EVM Mempool Inspection, Distributed Architectures & Forensics
            </p>
          </div>
        </div>

        <div className={styles.boxesGroup}>
          <div className={styles.box}>
            <span className={`${styles.boxBadge} ${styles.badgeLavender}`}>Stack</span>
            <div className={styles.stackList}>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg" alt="Elixir" width="14" height="14" />
                Elixir
              </span>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" alt="Rust" width="14" height="14" className={styles.rustIcon} />
                Rust
              </span>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg" alt="Julia" width="14" height="14" />
                Julia
              </span>
              <span className={styles.stackItem}>
                <TerminalIcon />
                EVM
              </span>
            </div>
          </div>

          <div className={styles.box}>
            <span className={`${styles.boxBadge} ${styles.badgeSky}`}>Links</span>
            <div className={styles.socials}>
              <a 
                href="https://t.me/ventie" 
                target="_blank" 
                rel="noreferrer" 
                className={styles.socialLink}
              >
                <TelegramIcon />
                <span>Telegram</span>
                <ExternalLinkIcon />
              </a>
              <a 
                href="https://github.com/itsVentie" 
                target="_blank" 
                rel="noreferrer" 
                className={styles.socialLink}
              >
                <GithubIcon />
                <span>GitHub</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}