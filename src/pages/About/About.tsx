import { SummaryStory } from '../../components/About/Summary';
import { PersonalityCard } from '../../components/About/PersonalityCard';
import { MindGamesCard } from '../../components/About/MindGamesCard';
import { VideoGamesCard } from '../../components/About/VideoGamesCard';
import { MediaCard } from '../../components/About/MediaCard';
import { LanguagesCard } from '../../components/About/LanguagesCard';
import styles from '../../styles/About/About.module.css';

export function About() {
  return (
    <main className={styles.container}>
      <SummaryStory />

      <div className={styles.grid}>
        <PersonalityCard />
        <MindGamesCard />
        <VideoGamesCard />
        <MediaCard />
        <LanguagesCard />
      </div>
    </main>
  );
}