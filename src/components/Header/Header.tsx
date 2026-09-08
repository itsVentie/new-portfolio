import styles from '../../styles/components/Header.module.css';

type Page = 'home' | 'about' | 'projects' | 'contact';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <button 
          onClick={() => onNavigate('home')} 
          className={styles.logo}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          My portfolio
        </button>
        <nav className={styles.nav}>
          <button 
            onClick={() => onNavigate('about')} 
            className={`${styles.navLink} ${currentPage === 'about' ? styles.active : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            About me
          </button>
          <button 
            onClick={() => onNavigate('projects')} 
            className={`${styles.navLink} ${currentPage === 'projects' ? styles.active : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Projects
          </button>
          <button 
            onClick={() => onNavigate('contact')} 
            className={`${styles.navLink} ${currentPage === 'contact' ? styles.active : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Contacts
          </button>
        </nav>
      </div>
    </header>
  );
}