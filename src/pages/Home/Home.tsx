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
        <FeaturedProject />
        <CurrentFocus />
        <LanguagesBalance />
        <ToolingEnvironment />
        <MusicCard />
        <LearningPipeline />
        <GithubActivity />
      </div>
    </main>
  );
}