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
      <HeroCard />

      <div className={styles.grid}>
        <div id="project" className={styles.spanThree}>
          <FeaturedProject />
        </div>
        <div id="focus" className={styles.spanTwo}>
          <CurrentFocus />
        </div>
        <div id="languages">
          <LanguagesBalance />
        </div>
        <div id="tools">
          <ToolingEnvironment />
        </div>
        <div id="music">
          <MusicCard />
        </div>
        <div id="pipeline">
          <LearningPipeline />
        </div>
        <div id="github" className={styles.spanThree}>
          <GithubActivity />
        </div>
      </div>
    </main>
  );
}