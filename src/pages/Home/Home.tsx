import styles from '../../styles/Home/Home.module.css';
import { HeroCard } from '../../components/Home/HeroCard';
import { FeaturedProject } from '../../components/Home/FeaturedProject';
import { CurrentFocus } from '../../components/Home/CurrentFocus';
import { LanguagesBalance } from '../../components/Home/LanguagesBalance';
import { ToolingEnvironment } from '../../components/Home/Tooling';
import { LearningPipeline } from '../../components/Home/LearningPipeline';
import { GithubActivity } from '../../components/Home/GithubActivity';
import { MusicCard } from '../../components/Home/MusicCard';

export function Home() {
  return (
    <main className={styles.container}>
      <aside className={styles.floatingSidebar}>
        <div className={styles.tocCard}>
          <span className={styles.tocTitle}>Navigation</span>
          <nav className={styles.tocNav}>
            <a href="#project" className={styles.tocLink}>#project</a>
            <a href="#focus" className={styles.tocLink}>#focus</a>
            <a href="#languages" className={styles.tocLink}>#languages</a>
            <a href="#tools" className={styles.tocLink}>#tools</a>
            <a href="#music" className={styles.tocLink}>#music</a>
            <a href="#pipeline" className={styles.tocLink}>#pipeline</a>
            <a href="#github" className={styles.tocLink}>#github</a>
          </nav>
        </div>
      </aside>

      <HeroCard />

      <div className={styles.grid}>
        <div id="project" className={styles.sectionAnchor}><FeaturedProject /></div>
        <div id="focus" className={styles.sectionAnchor}><CurrentFocus /></div>
        <div id="languages" className={styles.sectionAnchor}><LanguagesBalance /></div>
        <div id="tools" className={styles.sectionAnchor}><ToolingEnvironment /></div>
        <div id="music" className={styles.sectionAnchor}><MusicCard /></div>
        <div id="pipeline" className={styles.sectionAnchor}><LearningPipeline /></div>
        <div id="github" className={styles.sectionAnchor}><GithubActivity /></div>
      </div>
    </main>
  );
}