import { useState } from 'preact/hooks';
import styles from '../../styles/About/Summary.module.css';

export function SummaryStory() {
  const [activeTab, setActiveTab] = useState<'summary' | 'story'>('summary');

  return (
    <section className={styles.storyCard}>
      <div className={styles.topRow}>
        <div className={styles.badgeGroup}>
          <span className={styles.badgeText}>Systems Security Engineer</span>
        </div>

        <div className={styles.tabToggle}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'summary' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'story' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('story')}
          >
            Full Story
          </button>
        </div>
      </div>

      {activeTab === 'summary' ? (
        <div className={styles.contentBody}>
          <h2 className={styles.headline}>
            Designing clean software, scalable architecture, and reliable systems.
          </h2>
          <p className={styles.paragraph}>
            Systems engineer passionate about building high-performance applications, low-level tooling, 
            and secure software solutions. Focused on writing robust, maintainable code with attention to 
            system internals, memory safety, and performance optimization.
          </p>

          <div className={styles.keyHighlights}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightNum}>01</span>
              <div>
                <strong>Backend & Systems Architecture</strong>
                <p>Building high-throughput services, API layers, and efficient data processing pipelines.</p>
              </div>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightNum}>02</span>
              <div>
                <strong>Low-Level Engineering</strong>
                <p>Working closely with system resources, concurrency, and memory management.</p>
              </div>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightNum}>03</span>
              <div>
                <strong>Security & Forensics</strong>
                <p>Analyzing system behaviors, diagnostic artifacts, and applying defensive coding practices.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.contentBody}>
          <h2 className={styles.headline}>
            Evolution as an Engineer: Curiosity, Systems, and Scalability
          </h2>

          <div className={styles.timelineStory}>
            <div className={styles.storyBlock}>
              <span className={styles.storyPhase}>Phase 1: Deep Dive Into Mechanics</span>
              <p>
                Started with a focus on understanding how hardware and OS-level operations interact with software. 
                Investigating system mechanics and security fundamentals established a strong basis for problem-solving.
              </p>
            </div>

            <div className={styles.storyBlock}>
              <span className={styles.storyPhase}>Phase 2: Building High-Performance Tools</span>
              <p>
                Shifted towards low-level tooling and distributed computing. Focused on writing fast, efficient code 
                capable of handling complex asynchronous operations without compromising stability.
              </p>
            </div>

            <div className={styles.storyBlock}>
              <span className={styles.storyPhase}>Phase 3: Clean Design & Engineering Focus</span>
              <p>
                Today, the focus is on maintaining clean abstractions, optimizing system workloads, and continuously 
                refining engineering workflows across modern stacks and frameworks.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}