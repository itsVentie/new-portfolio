import { useState, useRef, useEffect } from 'preact/hooks';
import styles from '../../../styles/components/AppLauncher.module.css';

interface AppItem {
  name: string;
  url: string;
  icon: string;
}

const SOCIAL_APPS: AppItem[] = [
  { name: 'GitHub', url: 'https://github.com/itsVentie', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Telegram', url: 'https://t.me/ventie', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' },
  { name: 'WakaTime', url: 'https://wakatime.com/@Ventie', icon: 'https://wakatime.com/static/img/wakatime.svg' },
];

const SITE_APPS: AppItem[] = [
  { name: 'Ventie.dev', url: 'https://ventie.dev', icon: 'https://ventie.dev/favicon.ico' },
  { name: 'Blog', url: 'https://blog.ventie.dev', icon: 'https://ventie.dev/favicon.ico' },
  { name: 'Docs', url: 'https://docs.ventie.dev', icon: 'https://ventie.dev/favicon.ico' },
];

export function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button 
        className={styles.launcherBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Apps menu"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="5" r="2" />
          <circle cx="12" cy="5" r="2" />
          <circle cx="19" cy="5" r="2" />
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="12" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.grid}>
            {SOCIAL_APPS.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className={styles.appItem}
              >
                <img src={app.icon} alt={app.name} className={styles.appIcon} />
                <span className={styles.appName}>{app.name}</span>
              </a>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.grid}>
            {SITE_APPS.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className={styles.appItem}
              >
                <img src={app.icon} alt={app.name} className={styles.appIcon} />
                <span className={styles.appName}>{app.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}