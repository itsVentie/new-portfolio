import { useState, useEffect, useRef } from 'preact/hooks';
import styles from '../../styles/Home/Home.module.css';
import { HeroCard } from '../../components/Home/HeroCard';
import { FeaturedProject } from '../../components/Home/FeaturedProject';
import { CurrentFocus } from '../../components/Home/CurrentFocus';
import { LanguagesBalance } from '../../components/Home/LanguagesBalance';
import { ToolingEnvironment } from '../../components/Home/Tooling';
import { LearningPipeline } from '../../components/Home/LearningPipeline';
import { GithubActivity } from '../../components/Home/GithubActivity';
import { MusicCard } from '../../components/Home/MusicCard';

const SECTIONS = ['project', 'focus', 'languages', 'tools', 'music', 'pipeline', 'github'];

export function Home() {
  const [activeSection, setActiveSection] = useState<string>('');
  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px', 
        threshold: 0,
      }
    );

    SECTIONS.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: MouseEvent, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      isManualScrolling.current = true;
      setActiveSection(sectionId);
      
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${sectionId}`);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  return (
    <main className={styles.container}>
      <aside className={styles.floatingSidebar}>
        <div className={styles.tocCard}>
          <span className={styles.tocTitle}>Navigation</span>
          <nav className={styles.tocNav}>
            {SECTIONS.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => handleNavClick(e, section)}
                className={`${styles.tocLink} ${activeSection === section ? styles.active : ''}`}
              >
                #{section}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <HeroCard />

      <div className={styles.grid}>
        <div id="project" className={`${styles.sectionAnchor} ${styles.spanThree} ${activeSection === 'project' ? styles.activeSection : ''}`}><FeaturedProject /></div>
        <div id="focus" className={`${styles.sectionAnchor} ${styles.spanTwo} ${activeSection === 'focus' ? styles.activeSection : ''}`}><CurrentFocus /></div>
        <div id="languages" className={`${styles.sectionAnchor} ${activeSection === 'languages' ? styles.activeSection : ''}`}><LanguagesBalance /></div>
        <div id="tools" className={`${styles.sectionAnchor} ${activeSection === 'tools' ? styles.activeSection : ''}`}><ToolingEnvironment /></div>
        <div id="music" className={`${styles.sectionAnchor} ${activeSection === 'music' ? styles.activeSection : ''}`}><MusicCard /></div>
        <div id="pipeline" className={`${styles.sectionAnchor} ${activeSection === 'pipeline' ? styles.activeSection : ''}`}><LearningPipeline /></div>
        <div id="github" className={`${styles.sectionAnchor} ${styles.spanThree} ${activeSection === 'github' ? styles.activeSection : ''}`}><GithubActivity /></div>
      </div>
    </main>
  );
}