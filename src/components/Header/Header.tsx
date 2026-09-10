import { useState, useEffect } from 'preact/hooks';
import styles from '../../styles/components/Header.module.css';
import { AppLauncher } from './AppLauncher/AppLauncher';
import logoSvg from '../../assets/logos/fueki.svg';

type Page = 'home' | 'about' | 'projects' | 'download' | 'contact';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About me' },
  { id: 'projects', label: 'Projects' },
  { id: 'download', label: 'Download' },
  { id: 'contact', label: 'Contacts' },
];

const REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

function ViewsBadge() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!REDIS_URL || !REDIS_TOKEN) {
      console.warn('Upstash env variables are missing');
      return;
    }

    fetch(`${REDIS_URL}/incr/page_views`, {
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.result === 'number') {
          setViews(data.result);
        }
      })
      .catch((err) => {
        console.error('Redis error:', err);
      });
  }, []);

  return (
    <div className={styles.viewsBadge} title="Total page views">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span className={styles.viewsCount}>
        {views !== null ? views.toLocaleString() : '...'}
      </span>
    </div>
  );
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button 
          onClick={() => onNavigate('home')} 
          className={styles.logoBtn}
          aria-label="Go to home"
        >
          <img src={logoSvg} alt="Logo" className={styles.logoImg} />
        </button>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`${styles.navLink} ${currentPage === item.id ? styles.active : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.rightGroup}>
          <ViewsBadge />
          <AppLauncher />
        </div>
      </div>
    </header>
  );
}