import { useState } from 'preact/hooks';
import styles from '../../styles/components/ProfileHeader.module.css';

const BriefcaseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const LocationIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M128,0 C57.307,0 0,57.307 0,128 C0,198.693 57.307,256 128,256 C198.693,256 256,198.693 256,128 C256,57.307 198.693,0 128,0 Z" fill="#229ED9" />
    <path d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308" fill="#FFFFFF" />
    <path d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475" fill="#D2E5F1" />
    <path d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624" fill="#B5CFE4" />
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function ProfileHeader() {
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ventie@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.leftColumn}>
          <div className={styles.avatarWrapper}>
            {!hasError ? (
              <img
                src="https://github.com/itsVentie.png"
                alt="Ventie avatar"
                className={styles.avatarImg}
                onError={() => setHasError(true)}
              />
            ) : (
              <div className={styles.avatarFallback}>V</div>
            )}
            <span className={styles.statusIndicator} title="Available for projects">
              <span className={styles.statusPing} />
            </span>
          </div>

          <div className={styles.titleBox}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>Ventie</h1>
              <span className={styles.roleTag}>Systems & Security Engineer</span>
              <span className={styles.username}>@Ventie</span>
            </div>

            <p className={styles.bio}>
              Hello dear! We don't know anything, we're just larping. Oka-aay, scene is over!
            </p>

            <div className={styles.statsRow}>
  <div className={styles.statsBadgesGroup}>
    <span className={styles.statBadge}>
      <BriefcaseIcon />
      <span>5+ yrs experience</span>
    </span>
    <span className={styles.statBadge}>
      <LocationIcon />
      <span>Remote / UTC+2</span>
    </span>
  </div>

  <a
    href="https://wakatime.com/@Ventie"
    target="_blank"
    rel="noreferrer"
    className={styles.wakatimeBadgeLink}
  >
    <img
      src="https://wakatime.com/badge/user/0be43041-4b4c-455a-989e-bc8a809cf10e.svg"
      alt="WakaTime Stats"
    />
  </a>
</div>
          </div>
        </div>

        <div className={styles.boxesGroup}>
          <div className={styles.box}>
            <span className={`${styles.boxBadge} ${styles.badgeLavender}`}>Stack</span>
            <div className={styles.stackList}>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" width="14" height="14" />
                C++
              </span>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" alt="Rust" width="14" height="14" className={styles.rustIcon} />
                Rust
              </span>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" alt="Golang" width="14" height="14" />
                Golang
              </span>
              <span className={styles.stackItem}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width="14" height="14" />
                Python
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
                aria-label="Telegram"
              >
                <TelegramIcon />
                <span>Telegram</span>
              </a>
              <a
                href="https://github.com/itsVentie"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <GithubIcon />
                <span>GitHub</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`${styles.socialLink} ${styles.emailBtn}`}
                aria-label="Copy Email"
              >
                <MailIcon />
                <span>{copied ? 'Copied!' : 'Email'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}