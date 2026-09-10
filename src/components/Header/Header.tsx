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
          <AppLauncher />
        </div>
      </div>
    </header>
  );
}